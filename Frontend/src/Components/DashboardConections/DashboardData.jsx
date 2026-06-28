import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useConnection } from "../../Context/ConnectionContext";
import AllFilter from "../Dashboard/AllFilter";
import toast from "react-hot-toast";
import { saveAs } from 'file-saver';

import DashboardTabs from "./DashboardTabs";
import ConnectionsTable from "./ConnectionsTable";
import CustomersTable from "./CustomersTable";
import UsersTable from "../User/UsersTable";
import { useDashboard } from "../../Context/DashboardContext";

const DashboardData = () => {
  const { user } = useAuth(); 
  const { Generate } = useConnection(); 
  
  const { 
    activeTab, 
    setActiveTab,
    fetchConnectionsList, 
    fetchCustomersList,
    connections,
    customers,
    users,
    connStatusFilter,fetchUsersList,metrics,loadingMetrics
  } = useDashboard(); 
  const [selectedConnections, setSelectedConnections] = useState([]);

  const list = [
    { name: "connections",length:loadingMetrics ? "..." : metrics?.performance?.totalOpportunities ?? 0, },
    (user?.role === "employee" || user?.role === "admin") && { name: "customers",length:loadingMetrics ? "..." : metrics?.performance?.totalCustomers?? 0, },
    user?.role === "admin" && { name: "users",length:loadingMetrics ? "..." : metrics?.performance?.totalUsers ?? 0 },
  ].filter(Boolean); 

  const data = useMemo(() => ({
    connections: connections || [],
    customers: customers || [],
    users: users || []
  }), [connections, customers, users]);

  const displayData = useMemo(() => {
    if (activeTab === "connections") return connections;
    if (activeTab === "customers") return customers;
    if (activeTab === "users") return users;
    return [];
  }, [activeTab, connections, customers, users]);

const handleFilterChange = (newFilterValue) => {
  if (activeTab === "connections") {
    fetchConnectionsList(1, newFilterValue, false); 
  } else if (activeTab === "customers") {
    fetchCustomersList(1, newFilterValue, false);
  } else if (activeTab === "users") {
    fetchUsersList(1, newFilterValue, false);
  }
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
      if (actualBlob.type === 'application/json') {
        setSelectedConnections([]);
        return;
      } else {
        saveAs(actualBlob, `Order_Documents_${Date.now()}.zip`); 
      }
      
      fetchConnectionsList(1, connStatusFilter, false);
      setSelectedConnections([]);
    } catch (error) {
      console.error("Order processing error.");
    }
  }; 

  return (
    <div className="flex-[3] h-[55vh] relative">
      <div className="flex md:flex-row flex-col justify-between gap-4 border-b mb-4">
        <DashboardTabs
          list={list}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          data={data}
        />

        <div className="flex items-center gap-4">
          {(user?.role === "employee" || user?.role === "admin") && (
            <AllFilter type={activeTab} onFilterChange={handleFilterChange} />
          )}

          {(user?.role === "order_generation" || user?.role === "admin") &&
            activeTab === "connections" &&
            selectedConnections.length > 0 && (
              <div className="bg-indigo-50 border border-indigo-200 px-4 py-1.5 rounded-lg flex items-center gap-3 mb-2">
                <span className="text-sm font-semibold text-indigo-700">
                  {selectedConnections.length} selected
                </span>
                <button
                  type="button"
                  onClick={handleProcessSelected}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded font-bold shadow-sm transition-colors"
                >
                  Process Orders
                </button>
              </div>
            )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto border-black">
        {activeTab === "connections" && (
          <ConnectionsTable
            user={user}
            selectedConnections={selectedConnections}
            handleSelectConnection={handleSelectConnection}
          />
        )}

        {activeTab === "customers" && (
          <CustomersTable />
        )}
        
        {activeTab === "users" && (
          <UsersTable />
        )}

        {displayData?.length === 0 && (
          <div className="p-10 text-center text-gray-400">
            No {activeTab} records found.
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardData;