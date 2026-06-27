import React from "react";
import { Link } from "react-router-dom";
import { useDashboard } from "../../Context/DashboardContext"; // 🚀 Connect to dashboard context

const CustomersTable = () => {
  // 1. Consume paginated customers arrays and execution flags
  const { 
    customers, 
    loadingCustomers, 
    custHasMore, 
    custPage, 
    fetchCustomersList ,custFilter
  } = useDashboard();

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      if (!loadingCustomers && custHasMore) {
        fetchCustomersList(custPage + 1, custFilter, true);
      }
    }
  };

  return (
    <div 
      className="max-h-[60vh] overflow-y-auto overflow-x-auto relative"
      onScroll={handleScroll}
    >
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0 z-10 shadow-sm">
          <tr>
            <th className="p-4 bg-gray-100">Company Name</th>
            <th className="p-4 bg-gray-100">Contact Person</th>
            <th className="p-4 bg-gray-100">Email</th>
            <th className="p-4 bg-gray-100">Mobile</th>
            <th className="p-4 bg-gray-100">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {customers.map((cust) => (
            <tr key={cust._id} className="border-b hover:bg-gray-50 transition-colors">
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
        </tbody>
      </table>

      {/* Grid bottom loader indicator */}
      {loadingCustomers && (
        <div className="flex items-center justify-center p-4 bg-gray-50/50">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-xs text-gray-500 ml-2">Loading more accounts...</span>
        </div>
      )}
    </div>
  );
};

export default CustomersTable;