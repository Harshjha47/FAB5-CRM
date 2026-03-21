import CustomerDetailCard from "./CustomerDetailCard";
import { useNavigate, useParams } from "react-router-dom";
import { useConnection } from "../../Context/ConnectionContext";
import { useEffect, useMemo } from "react";
import CreateConnection from "../Connection/CreateConnection";
import ConnectionList from "../Connection/ConnectionList";
import { useAuth } from "../../Context/AuthContext";

function CustomerSumDetails() {
  const { getConnection,connectionData } = useConnection();
  
  const { id } = useParams();
  useEffect(() => {
    getConnection(id);
  }, []);
  console.log(connectionData);
  
  const navigate = useNavigate();
  const { allData } = useAuth();

  // 1. Find the specific customer from your global data
  const customer = useMemo(() => {
    return allData?.customers?.find(c => c._id === id);
  }, [allData, id]);

  // Loading & Error States
  if (!allData) {
    return (
      <div className="flex justify-center p-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-10 text-center text-gray-500">
        <p className="text-xl font-bold">Customer not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 hover:underline">Go Back</button>
      </div>
    );
  }
  

  return (
    <section className="w-full flex flex-col  gap-2 h-full ">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 relative overflow-hidden">
        {/* Decorative top border */}
        <div className={`absolute top-0 left-0 w-full h-1 ${customer.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Contact Person: <span className="font-medium text-gray-700">{customer.person}</span></p>
            
            <div className="flex items-center gap-2 mt-4">
              <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${customer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {customer.isActive ? 'Active Account' : 'Inactive Account'}
              </span>
              <span className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded border">
                ID: {customer._id}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm md:text-right">
            <div className="flex items-center md:justify-end gap-2 text-gray-600">
              <span>📧</span>
              <a href={`mailto:${customer.email}`} className="text-indigo-600 hover:underline font-medium">{customer.email}</a>
            </div>
            <div className="flex items-center md:justify-end gap-2 text-gray-600">
              <span>📞</span>
              <span className="font-medium">{customer.mobile}</span>
            </div>
            {customer.createdAt && (
              <div className="text-xs text-gray-400 mt-2">
                Client since {new Date(customer.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* --- Associated Connections Section --- */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">
          Services & Connections ({connectionData?.length})
        </h2>
      </div>

      {/* 💥 THIS IS WHERE THE MAGIC HAPPENS 💥 */}
      {/* We just drop in the component we built earlier, passing it the filtered list! */}
      
      {connectionData?.length>0?<ConnectionList connections={connectionData} />
      :<CreateConnection/>}
    </section>
  );
}

export default CustomerSumDetails; 
