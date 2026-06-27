import React from "react";

const DashboardTabs = ({ list, activeTab, setActiveTab, data }) => {
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
          {tab.name} ({data[tab.name]?.length || 0})
        </button>
      ))}
    </div>
  );
};

export default DashboardTabs;