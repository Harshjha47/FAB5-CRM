import React from "react";
import { useAuth } from "../../Context/AuthContext";

const DashboardTabs = ({ list, activeTab, setActiveTab, data }) => {
  const {user}=useAuth()
  console.log(user.role)
  return (
    <div className="flex gap-4">
      {list?.map((tab) => (
        <button
          type="button"
          key={tab.name}
          onClick={() => setActiveTab(tab.name)}
          className={`pb-2 px-4 capitalize transition-all ${
            activeTab === tab.name
              ? "border-b-2 border-blue-600 text-blue-600 font-bold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.name}{user?.role==='admin'||user?.role=='employee'?`(${tab?.length})`:""} 
        </button>
      ))}
    </div>
  );
};

export default DashboardTabs;