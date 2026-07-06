import React from "react";
import { Link } from "react-router-dom";
import { useDashboard } from "../../Context/DashboardContext"; 

const ConnectionsTable = ({
  user,
  selectedConnections,
  handleSelectConnection,
}) => {
  const { 
    connections, 
    loadingConnections, 
    connHasMore, 
    connPage, 
    connStatusFilter, 
    fetchConnectionsList 
  } = useDashboard();

  const showCheckboxColumn = user?.role === "order_generation" || user?.role === "admin";


  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      if (!loadingConnections && connHasMore) {
        fetchConnectionsList(connPage + 1, connStatusFilter, true);
      }
    }
  };

  return (
    <div 
      className="max-h-[50vh] overflow-y-auto overflow-x-auto  border-gray-500 relative"
      onScroll={handleScroll}
    >
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0 z-10 shadow-sm">
          <tr>
            {showCheckboxColumn && <th className="p-4 w-10 bg-gray-100">Select</th>}
            <th className="p-4 bg-gray-100">OID</th>
            <th className="p-4 bg-gray-100">Customer</th>
            <th className="p-4 bg-gray-100">Service</th>
            <th className="p-4 bg-gray-100">Bandwidth</th>
            <th className="p-4 bg-gray-100">
              {user?.role === "employee" || user?.role === "admin" ? "Status" : "Created By"}
            </th>
            <th className="p-4 bg-gray-100">Telco</th>
            <th className="p-4 bg-gray-100">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {connections.map((conn) => {
            const hasProviderCost = Boolean(
              conn?.providerCost?.ratePerMb && Number(conn?.providerCost?.ratePerMb) > 0
            );
            const isSelected = selectedConnections.includes(conn._id);

            return (
              <tr
                key={conn._id}
                className={`border-b transition-colors ${
                  isSelected ? "bg-indigo-50/50" : "hover:bg-gray-50"
                }`}
              >
                {showCheckboxColumn && (
                  <td className="p-4">
                    {conn?.status === "Approved" && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={!hasProviderCost}
                        onChange={() => handleSelectConnection(conn._id, hasProviderCost)}
                        className={`w-4 h-4 rounded cursor-pointer ${
                          !hasProviderCost ? "opacity-30 cursor-not-allowed" : "accent-indigo-600"
                        }`}
                        title={!hasProviderCost ? "Cannot select: Missing bandwidth" : "Select connection"}
                      />
                    )}
                  </td>
                )}
                <td className="p-4 font-medium">{conn?.opportunityId || "######"}</td>
                <td className="p-4 font-medium">{conn?.customer?.name}</td>
                <td className="p-4 text-gray-600">{conn?.serviceType}</td>
                <td className="p-4">{conn?.bandwidth ? `${conn.bandwidth} Mbps` : "Missing"}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      conn?.status === "Pending" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
                    }`}
                  >
                    {user?.role === "employee" || user?.role === "admin"
                      ? conn?.status === "Generation" ? "Implementation" : conn?.status
                      : conn?.createdBy?.name}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{conn?.technicalDetails?.telcoProvider}</td>
                <td className="p-4">
                  <Link
                    to={`/customer/${conn?.customer?._id}/connection/${conn?._id}/history`}
                    className="border border-[#0000ff2a] text-[#00001f] font-semibold px-4 py-1 rounded-xl bg-[#1100ff27]"
                  >
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {loadingConnections && (
        <div className="flex items-center justify-center p-4 bg-gray-50/50">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-xs text-gray-500 ml-2">Loading older connections...</span>
        </div>
      )}
    </div>
  );
};

export default ConnectionsTable;