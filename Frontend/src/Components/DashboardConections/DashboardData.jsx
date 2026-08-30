import { useMemo, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useConnection } from "../../Context/ConnectionContext";
import AllFilter from "../Dashboard/AllFilter";
import toast from "react-hot-toast";
import { saveAs } from "file-saver";

import ConnectionsTable from "./ConnectionsTable";
import CustomersTable from "./CustomersTable";
import UsersTable from "../User/UsersTable";
import { useDashboard } from "../../Context/DashboardContext";

const TITLES = { connections: "Connections", customers: "Customers", users: "Team" };

const DashboardData = () => {
  const { user } = useAuth();
  const { Generate } = useConnection();

  const {
    activeTab,
    fetchConnectionsList,
    fetchCustomersList,
    fetchUsersList,
    connections,
    customers,
    users,
    connStatusFilter,
    totalCount,
  } = useDashboard();

  const [selectedConnections, setSelectedConnections] = useState([]);

  const displayData = useMemo(() => {
    if (activeTab === "connections") return connections;
    if (activeTab === "customers") return customers;
    if (activeTab === "users") return users;
    return [];
  }, [activeTab, connections, customers, users]);

  const isStaff = user?.role === "employee" || user?.role === "admin";
  const canOrder = user?.role === "order_generation" || user?.role === "admin";
  const showSelectionBar = canOrder && activeTab === "connections" && selectedConnections.length > 0;

  const handleFilterChange = (newFilterValue) => {
    console.log(newFilterValue)
    if (activeTab === "connections") fetchConnectionsList(1, newFilterValue, false);
    else if (activeTab === "customers") fetchCustomersList(1, newFilterValue, false);
    else if (activeTab === "users") fetchUsersList(1, newFilterValue, false);
  };

  const handleSelectConnection = (connId, hasProviderCost) => {
    if (!hasProviderCost) {
      toast.error("Cannot select a connection without bandwidth assigned.");
      return;
    }
    setSelectedConnections((prev) =>
      prev.includes(connId) ? prev.filter((id) => id !== connId) : [...prev, connId]
    );
  };

  const handleProcessSelected = async () => {
    if (selectedConnections.length === 0) return;
    try {
      const response = await Generate(selectedConnections);
      const actualBlob = response.data ? response.data : response;
      if (actualBlob.type === "application/json") {
        setSelectedConnections([]);
        return;
      }
      saveAs(actualBlob, `Order_Documents_${Date.now()}.zip`);
      fetchConnectionsList(1, connStatusFilter, false);
      setSelectedConnections([]);
    } catch (error) {
      console.error("Order processing error.");
    }
  };

  return (
    <div className="relative rounded-[22px] bg-[#fbfaff] p-[18px]">
      <div className="mb-3.5 flex items-center gap-2.5">
        <span className="shrink-0 whitespace-nowrap text-[15px] font-semibold -tracking-[0.4px] text-[#1a1b21]">
          {TITLES[activeTab]}
        </span>
        {/* <span className="shrink-0 whitespace-nowrap font-mono text-[10.5px] text-[#a8abbb]">
          {displayData?.length ?? 0}
          {totalCount ? ` / ${totalCount}` : ""}
        </span> */}

        {isStaff && (
          <div className="ml-auto flex flex-1 min-w-0 gap-1 overflow-x-auto pb-0.5">
            <AllFilter type={activeTab} onFilterChange={handleFilterChange} />
          </div>
        )}
      </div>

      {showSelectionBar && (
        <div className="mb-3 flex items-center gap-3 rounded-[14px] bg-[#efecfd] py-2.5 pl-4 pr-2.5">
          <span className="whitespace-nowrap text-xs font-semibold text-[#4a3fb0]">
            {selectedConnections.length} approved selected
          </span>
          <button
            type="button"
            onClick={handleProcessSelected}
            className="h-8 whitespace-nowrap rounded-[10px] bg-[#6c5ce7] px-[15px] text-[11.5px] font-semibold text-white transition hover:brightness-110"
          >
            Process orders
          </button>
          <button
            type="button"
            onClick={() => setSelectedConnections([])}
            className="h-8 whitespace-nowrap rounded-[10px] px-3 text-[11.5px] font-medium text-[#7a7f94] hover:bg-white"
          >
            Clear
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        {activeTab === "connections" && (
          <ConnectionsTable
            user={user}
            selectedConnections={selectedConnections}
            handleSelectConnection={handleSelectConnection}
          />
        )}
        {activeTab === "customers" && <CustomersTable />}
        {activeTab === "users" && <UsersTable />}

        {displayData?.length === 0 && (
          <div className="py-11 text-center text-[12.5px] text-[#9ba0b0]">
            No {activeTab === "users" ? "team" : activeTab} records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardData;