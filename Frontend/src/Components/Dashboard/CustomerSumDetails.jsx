import CustomerDetailCard from "./CustomerDetailCard";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useConnection } from "../../Context/ConnectionContext";
import { useEffect, useMemo } from "react";
import CreateConnection from "../Connection/CreateConnection";
import ConnectionList from "../Connection/ConnectionList";
import { useAuth } from "../../Context/AuthContext";
import { exportConnectionsToExcel } from "../../Services/ExportToExcel";

function CustomerSumDetails() {
  const { getConnection, connectionData } = useConnection();
  const {user}=useAuth()
  
  const { id } = useParams();
  useEffect(() => {
    getConnection(id);
  }, []);  
  
  const navigate = useNavigate();
  const { allData } = useAuth();

  const customer = useMemo(() => {
    return allData?.customers?.find(c => c._id === id);
  }, [allData, id]);

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
    <section className="w-full flex flex-col gap-4 h-full">
      {/* --- Main Header Card (FIXED LAYOUT) --- */}
      {/* Removed min-h-[20vh] and added pb-8 to ensure nothing gets cut off */}
      {/* --- Main Header Card (PERMANENT LAYOUT FIX) --- */}
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4 border-t-4 ${customer.isActive ? 'border-t-green-500' : 'border-t-red-500'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Contact Person: <span className="font-medium text-gray-700">{customer.person}</span></p>
            <p className="text-sm text-gray-500">Customer Type: <span className="font-medium text-gray-700">{customer.customerType}</span></p>
            
            <div className="mt-3">
              <span className={`inline-block px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider ${customer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {customer.isActive ? 'Active Account' : 'Inactive Account'}
              </span>
            </div>
          </div>

          <div className="space-y-4 text-sm md:text-right w-full md:w-auto">
            <div className="space-y-2">
              <div className="flex items-center md:justify-end gap-2 text-gray-600">
                <span>📧</span>
                <a href={`mailto:${customer.email}`} className="text-indigo-600 hover:underline font-medium">{customer.email}</a>
              </div>
              <div className="flex items-center md:justify-end gap-2 text-gray-600">
                <span>📞</span>
                <span className="font-medium">{customer.mobile}</span>
              </div>
            </div>

            <div className="  flex md:justify-end flex-col md:flex-row gap-2">
              <button 
                onClick={() => exportConnectionsToExcel(connectionData, customer.name)}
                className="flex items-center gap-2 bg-green-700 justify-center hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95"
              >
                Export {connectionData?.length || 0} Connections
              </button>
              <Link to={"bulk"} className=" flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95">Import Connections</Link>
            </div>

            {customer.createdAt && (
              <div className="text-xs text-gray-400 mt-2">
                Client since {new Date(customer.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- KYC Documents Section --- */}
      {(user?.role == "admin" || user?.role == "owner")&&customer?.documents && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">KYC Documents</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Company Documents Column */}
            {customer.documents.companyDocuments?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider border-b pb-2">Company Documents</h3>
                <div className="flex flex-col gap-3">
                  {customer.documents.companyDocuments.map((doc, idx) => (
                    <div key={doc._id || idx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="text-2xl">📄</span>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-semibold text-gray-800 truncate" title={doc.fileName}>{doc.fileName}</span>
                          <span className="text-xs text-gray-500">{doc.documentType}</span>
                        </div>
                      </div>
                      <a 
                        href={`https://docs.google.com/viewer?url=${doc.url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-4 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors whitespace-nowrap"
                      >
                        View PDF
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Signatory Documents Column */}
            {customer.documents.signatoryDocuments?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider border-b pb-2">Signatory Documents</h3>
                <div className="flex flex-col gap-3">
                  {customer.documents.signatoryDocuments.map((doc, idx) => (
                    <div key={doc._id || idx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="text-2xl">📄</span>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-semibold text-gray-800 truncate" title={doc.fileName}>{doc.fileName}</span>
                          <span className="text-xs text-gray-500">{doc.documentType}</span>
                        </div>
                      </div>
                      <a 
                        href={`https://docs.google.com/viewer?url=${doc.url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-4 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors whitespace-nowrap"
                      >
                        View PDF
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}

      {/* --- Associated Connections Section --- */}
      <div className="mt-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">
          Services & Connections ({connectionData?.length || 0})
        </h2>
      </div>

      {connectionData?.length > 0 ? (
        <ConnectionList connections={connectionData} />
      ) : (
        <CreateConnection />
      )}
    </section>
  );
}

export default CustomerSumDetails;