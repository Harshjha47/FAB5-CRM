import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { Link } from "react-router-dom";
import AllFilter from "./AllFilter";
import toast from "react-hot-toast";
import { useConnection } from "../../Context/ConnectionContext";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const EmployeeDashboard = () => {
  const {
    allData,
    activeTab,
    setActiveTab,
    statusFilter,
    setStatusFilter,
    user,
    getDashboardData,
    loading,
  } = useAuth();
  const [data, setData] = useState(allData || []);
  const { Generate } = useConnection();
  // NEW: State to hold selected connections for order_generation
  const [selectedConnections, setSelectedConnections] = useState([]);

  useEffect(() => {
    if (user?.role === "owner") {
      setData({
        connections: allData?.connections?.filter(
          (e) => e?.status === "Pending",
        ),
      });
    } else if (user?.role === "order_generation") {
      setData({
        connections: allData?.connections?.filter(
          (e) => e?.status === "Approved",
        ),
      });
    } else if (user?.role === "project_manager") {
      setData({
        connections: allData?.connections?.filter(
          (e) => e?.status === "Generation",
        ),
      });
    } else {
      setData(allData);
    }
  }, [allData, user?.role]);

  const displayData = useMemo(() => {
    if (!data) return [];
    const currentList = data[activeTab] || [];
    if (statusFilter === "all") return currentList;

    return currentList?.filter((item) => {
      if (activeTab === "connections") {
        return (
          item?.status === statusFilter ||
          item?.technicalDetails?.telcoProvider === statusFilter
        );
      }
      if (activeTab === "users") {
        if (statusFilter === "incomplete") return !item?.isProfileComplete;
        return item?.role === statusFilter;
      }
      if (activeTab === "customers") {
        return String(item?.isActive) === statusFilter;
      }
      return true;
    });
  }, [data, activeTab, statusFilter]);

  const list = [
    { name: "connections" },
    (user?.role === "employee" || user?.role === "admin") && {
      name: "customers",
    },
    user?.role === "admin" && { name: "users" },
  ].filter(Boolean);

  useEffect(() => {
    if (!allData && !loading) {
      getDashboardData();
    }
  }, [allData, getDashboardData, loading]);

  // NEW: Handle checking/unchecking a connection
  const handleSelectConnection = (connId, hasProviderCost) => {
    if (!hasProviderCost) {
      toast.error("Cannot select a connection without bandwidth assigned.");
      return;
    }

    setSelectedConnections((prev) => {
      if (prev.includes(connId)) {
        return prev.filter((id) => id !== connId); // Remove if already selected
      } else {
        return [...prev, connId]; // Add if not selected
      }
    });
  };

  // NEW: Handle final submission of selected connections
  const handleProcessSelected = async () => {
    if (selectedConnections.length === 0) return;

    try {
      const response = await Generate(selectedConnections);
      const actualBlob = response.data ? response.data : response;
      if (actualBlob.type === 'application/json') {
        const text = await actualBlob.text();
        const data = JSON.parse(text);
        setSelectedConnections([]);
        return;
      } else {
        saveAs(actualBlob, `Order_Documents_${Date.now()}.zip`);
      }
      setData((prevData) => ({
        ...prevData,
        connections: prevData.connections.filter(
          (conn) => !selectedConnections.includes(conn._id)
        )
      }));
      setSelectedConnections([]);
    } catch (error) {
      console.error("Order processing aborted due to error.");
    }
  };

  if (loading || !data || !allData) {
    return (
      <div className="flex items-center justify-center flex-[3] min-h-[55vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-gray-500">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="flex-[3] min-h-[55vh] overflow-auto relative ">
      <div className="mb-6 flex md:flex-row flex-col justify-between gap-4 border-b">
        <div className="flex gap-4">
          {list?.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`pb-2 px-4 capitalize ${activeTab === tab.name ? "border-b-2 border-blue-600 text-blue-600 font-bold" : "text-gray-500"}`}
            >
              {tab.name} ({data[tab.name]?.length || 0})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {(user?.role === "employee" || user?.role === "admin") && (
            <AllFilter type={activeTab} onFilterChange={setStatusFilter} />
          )}

          {/* NEW: Action Toolbar for Order Generation */}
          {user?.role === "order_generation" &&
            activeTab === "connections" &&
            selectedConnections.length > 0 && (
              <div className="bg-indigo-50 border border-indigo-200 px-4 py-1.5 rounded-lg flex items-center gap-3 mb-2">
                <span className="text-sm font-semibold text-indigo-700">
                  {selectedConnections.length} selected
                </span>
                <button
                  onClick={handleProcessSelected}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded font-bold shadow-sm transition-colors"
                >
                  Process Orders
                </button>
              </div>
            )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            {activeTab === "connections" && (
              <tr>
                {/* NEW: Select Header for Order Generation */}
                {user?.role === "order_generation" && (
                  <th className="p-4 w-10">Select</th>
                )}
                <th className="p-4">OID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Service</th>
                <th className="p-4">Bandwidth</th>
                <th className="p-4">
                  {user?.role === "employee" || user?.role === "admin"
                    ? "Status"
                    : "Created By"}
                </th>
                <th className="p-4">Telco</th>
                <th className="p-4">Action</th>
              </tr>
            )}
            {activeTab === "customers" && (
              <tr>
                <th className="p-4">Company Name</th>
                <th className="p-4">Contact Person</th>
                <th className="p-4">Email</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Action</th>
              </tr>
            )}
            {activeTab === "users" && (
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Profile</th>
                <th className="p-4">Action</th>
              </tr>
            )}
          </thead>
          <tbody className="text-sm border-black">
            {activeTab === "connections" &&
              displayData?.map((conn) => {
                // Check if bandwidth exists and is greater than 0
                const hasProviderCost = Boolean(
                  conn?.providerCost?.ratePerMb &&
                  Number(conn?.providerCost?.ratePerMb) > 0,
                );
                const isSelected = selectedConnections.includes(conn._id);

                return (
                  <tr
                    key={conn._id}
                    className={`border-b transition-colors ${isSelected ? "bg-indigo-50/50" : "hover:bg-gray-50"}`}
                  >
                    {/* NEW: Checkbox Cell for Order Generation */}
                    {user?.role === "order_generation" && (
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={!hasProviderCost}
                          onChange={() =>
                            handleSelectConnection(conn._id, hasProviderCost)
                          }
                          className={`w-4 h-4 rounded cursor-pointer ${!hasProviderCost ? "opacity-30 cursor-not-allowed" : "accent-indigo-600"}`}
                          title={
                            !hasProviderCost
                              ? "Cannot select: Missing bandwidth"
                              : "Select connection"
                          }
                        />
                      </td>
                    )}
                    <td className="p-4 font-medium">
                      {conn?.opportunityId || "######"}
                    </td>
                    <td className="p-4 font-medium">{conn?.customer?.name}</td>
                    <td className="p-4 text-gray-600">{conn?.serviceType}</td>
                    <td className="p-4">
                      <span

                      >
                        {conn?.bandwidth ? `${conn.bandwidth} Mbps` : "Missing"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${conn?.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}
                      >
                        {user?.role === "employee" || user?.role === "admin"
                          ? conn?.status === "Generation"
                            ? "Implementation"
                            : conn?.status
                          : conn?.createdBy?.name}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">
                      {conn.technicalDetails?.telcoProvider}
                    </td>
                    <td className="p-4">
                      <Link
                        to={`/customer/${conn?.customer?._id}/connection/${conn?._id}/history`}
                        className="border border-[#0000ff2a] text-[#00001f] font-semibold px-4  rounded-xl bg-[#1100ff27]"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}

            {activeTab === "customers" &&
              displayData?.map((cust) => (
                <tr key={cust._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{cust.name}</td>
                  <td className="p-4">{cust.person}</td>
                  <td className="p-4 text-blue-600">{cust.email}</td>
                  <td className="p-4">{cust.mobile}</td>
                  <td className="p-4">
                    <Link
                      to={`/customer/${cust?._id}`}
                      className="border border-[#d7d7ff2a] text-[#00001f] font-semibold px-4 py-1.5 rounded-md bg-[#1100ff27]"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}

            {activeTab === "users" &&
              displayData?.map((u) => (
                <tr key={u._id || u.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {u.name?.charAt(0)}
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold uppercase text-gray-600">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4 font-mono">{u.phone}</td>
                  <td className="p-4">
                    {u.isProfileComplete ? (
                      <span className="text-green-500 text-xs">Complete</span>
                    ) : (
                      <span className="text-orange-500 text-xs italic">
                        Incomplete
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <Link
                      to={`/employees/${u?._id}`}
                      className="border border-[#0000ff2a] text-[#00001f] font-semibold px-4  rounded-xl bg-[#e0deff27]"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {data[activeTab]?.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            No {activeTab} records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
