import React from "react";
import { Link } from "react-router-dom";
import { useDashboard } from "../../Context/DashboardContext";

const UsersTable = () => {
  const { 
    users, 
    loadingUsers, 
    userHasMore, 
    userPage, 
    fetchUsersList 
  } = useDashboard();

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      if (!loadingUsers && userHasMore) {
        fetchUsersList(userPage + 1, true);
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
            <th className="p-4 bg-gray-100">Name</th>
            <th className="p-4 bg-gray-100">Role</th>
            <th className="p-4 bg-gray-100">Email</th>
            <th className="p-4 bg-gray-100">Phone</th>
            <th className="p-4 bg-gray-100">Profile</th>
            <th className="p-4 bg-gray-100">Action</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {users.map((u) => (
            <tr key={u._id || u.id} className="border-b hover:bg-gray-50 transition-colors">
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
                  <span className="text-orange-500 text-xs italic">Incomplete</span>
                )}
              </td>
              <td className="p-4">
                <Link
                  to={`/employees/${u?._id}`}
                  className="border border-[#0000ff2a] text-[#00001f] font-semibold px-4 py-1 rounded-xl bg-[#e0deff27]"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loadingUsers && (
        <div className="flex items-center justify-center p-4 bg-gray-50/50">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-xs text-gray-500 ml-2">Loading more team members...</span>
        </div>
      )}
    </div>
  );
};

export default UsersTable;