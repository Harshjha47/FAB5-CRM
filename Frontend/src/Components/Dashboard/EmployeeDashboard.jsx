import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { Link } from 'react-router-dom';
import AllFilter from './AllFilter';
import Cancel from '../Connection/CancelOrder';

const EmployeeDashboard = () => {
    const { allData, activeTab, setActiveTab,
        statusFilter, setStatusFilter,user,getDashboardData } = useAuth()
    const [data, setData] = useState(allData||[])
    
    useEffect(() => { 
        if (user?.role==="owner") {
            setData({connections:allData?.connections?.filter(e=>e?.status==="Pending")})
        } else if (user?.role==="order_generation") {
            setData({connections:allData?.connections?.filter(e=>e?.status==="Approved")})
        } else if (user?.role==="project_manager") {
            setData({connections:allData?.connections?.filter(e=>e?.status==="Generation")})
        } else {
        setData(allData)
        }
     }, [allData])

    const displayData = useMemo(() => {
        if (!data) return [];
        const currentList = data[activeTab] || [];
        if (statusFilter === 'all') return currentList;

        return currentList?.filter(item => {
            if (activeTab === 'connections') {
                return item?.status === statusFilter || item?.technicalDetails?.telcoProvider === statusFilter;
                
            }
            if (activeTab === 'users') {
                if (statusFilter === 'incomplete') return !item?.isProfileComplete;
                return item?.role === statusFilter;
            }
            if (activeTab === 'customers') {
                return String(item?.isActive) === statusFilter;
            }
            return true;
        });
    }, [data, activeTab, statusFilter]);
    const list = [
  { name: "connections" },
  (user?.role === "employee"||user?.role === "admin" ) &&{ name: "customers" },
  (user?.role === "admin" ) &&{ name: "users" }
].filter(Boolean);

    if (!data) {
        getDashboardData()
        return (
            <div className="flex items-center justify-center flex-[3] min-h-[55vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="ml-3 text-gray-500">Loading dashboard data...</p>
            </div>
        );
    }
    

    return (
        <div className=" flex-[3] min-h-[55vh] overflow-auto">
            <div className="mb-6 flex md:flex-row flex-col justify-between gap-4 border-b">
                {list?.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        className={`pb-2 px-4 capitalize ${activeTab === tab.name ? 'border-b-2 border-blue-600 text-blue-600 font-bold' : 'text-gray-500'}`}
                    >
                        {tab.name} ({data[tab.name]?.length || 0})
                    </button>
                ))}
                {(user?.role=="employee"||user?.role=="admin")&&<AllFilter type={activeTab} onFilterChange={setStatusFilter} />}
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        {activeTab === 'connections' && (
                            <tr>
                                <th className="p-4">OID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Service</th>
                                <th className="p-4">Bandwidth</th>
                                <th className="p-4">{(user.role==="employee"||user.role==="admin")?"Status":"Created By"}</th>
                                <th className="p-4">Telco</th>
                                <th className="p-4">Action</th>
                            </tr>
                        )}
                        {activeTab === 'customers' && (
                            <tr>
                                <th className="p-4">Company Name</th>
                                <th className="p-4">Contact Person</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Mobile</th>
                                <th className="p-4">Action</th>
                            </tr>
                        )}
                        {activeTab === 'users' && (
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
                    <tbody className="text-sm  border-black">
                        {activeTab === 'connections' && displayData?.map((conn) => (
                            <tr key={conn._id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium">{conn?.opportunityId||"######"}</td>
                                <td className="p-4 font-medium">{conn?.customer?.name}</td>
                                <td className="p-4 text-gray-600">{conn?.serviceType}</td>
                                <td className="p-4">{conn?.bandwidth} Mbps</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${conn?.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                        {}{(user.role==="employee"||user.role==="admin")?conn?.status=='Generation'?"Implementation":conn?.status:conn?.createdBy?.name}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-500">{conn.technicalDetails?.telcoProvider}</td>
                                <td className="p-4">
                                    <Link to={`/customer/${conn?.customer?._id}/connection/${conn?._id}/history`} className="border border-[#0000ff2a] text-[#00001f] font-semibold px-4 rounded-md bg-[#1100ff27]">View</Link>

                                </td>
                            </tr>
                        ))}

                        {activeTab === 'customers' && displayData?.map((cust) => (
                            <tr key={cust._id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium">{cust.name}</td>
                                <td className="p-4">{cust.person}</td>
                                <td className="p-4 text-blue-600">{cust.email}</td>
                                <td className="p-4">{cust.mobile}</td>
                                <td className="p-4">
                                    <Link to={`/customer/${cust?._id}`} className="border border-[#d7d7ff2a] text-[#00001f] font-semibold px-4 rounded-md bg-[#1100ff27]">View</Link>
                                </td>
                            </tr>
                        ))}
                        {/* Added User Row Mapping */}
                        {activeTab === 'users' && displayData?.map((user) => (
                            <tr key={user._id || user.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                            {user.name?.charAt(0)}
                                        </div>
                                        <span className="font-medium">{user.name}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="bg-gray-100 px-2 py-1 rounded text-[10px] font-bold uppercase text-gray-600">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600">{user.email}</td>
                                <td className="p-4 font-mono">{user.phone}</td>
                                <td className="p-4">
                                    {user.isProfileComplete ? (
                                        <span className="text-green-500 text-xs">Complete</span>
                                    ) : (
                                        <span className="text-orange-500 text-xs italic">Incomplete</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    <Link to={`/employees/${user?._id}`} className="border border-[#0000ff2a] text-[#00001f] font-semibold px-4 rounded-md bg-[#e0deff27]">View</Link>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Empty State */}
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