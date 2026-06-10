import CustomerDetailCard from "./CustomerDetailCard";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useConnection } from "../../Context/ConnectionContext";
import { useEffect, useMemo, useState } from "react";
import CreateConnection from "../Connection/CreateConnection";
import ConnectionList from "../Connection/ConnectionList";
import { useAuth } from "../../Context/AuthContext";
import { useCustomer } from "../../Context/CustomerContext"; // Import Customer Context
import { exportConnectionsToExcel } from "../../Services/ExportToExcel";
import { Edit2, Trash2, X, AlertTriangle } from "lucide-react"; // Import Icons

const info = {
    name: "",
    person: "",
    email: "",
    mobile: "",
    customerType: ""
  }

function CustomerSumDetails() {
  const { getConnection, connectionData } = useConnection();
  const { editCustomer, deleteCustomer } = useCustomer(); // Get new functions
  const { user, allData } = useAuth();
  
  const { id } = useParams();
  const navigate = useNavigate();

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getConnection(id);
  }, [id, getConnection]);  

  const customer = useMemo(() => {
    return allData?.customers?.find(c => c._id === id);
  }, [allData, id]);

  const [editData, setEditData] = useState(info);

  // Populate edit form when modal opens
  useEffect(() => {
    if (customer) {
      setEditData({
        name: customer.name || "",
        person: customer.person || "",
        email: customer.email || "",
        mobile: customer.mobile || "",
        customerType: customer.customerType || ""
      });
    }
  }, [customer, isEditModalOpen]);

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

  const billingList = customer.billingProfile || customer.billingProfiles || [];

  // Submit Handlers
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      Object.keys(editData).forEach(key => formData.append(key, editData[key]));
      
      
      await editCustomer(id, formData);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setIsSubmitting(true);
    try {
      await deleteCustomer(id);
      setIsDeleteModalOpen(false);
      navigate("/dashboard"); // Redirect to dashboard after deletion
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full flex flex-col gap-4 h-full relative">
      
      {/* --- EDIT MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Edit Customer</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-700 transition">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">Company Name</label>
                <input required type="text" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">Contact Person</label>
                <input required type="text" value={editData.person} onChange={(e) => setEditData({...editData, person: e.target.value})} className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-600">Email</label>
                  <input required type="email" value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/50" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-gray-600">Mobile</label>
                  <input required type="text" value={editData.mobile} onChange={(e) => setEditData({...editData, mobile: e.target.value})} className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/50" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600">Customer Type</label>
                <select onChange={(e) => setEditData({...editData, customerType: e.target.value})} className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white">
                  <option value={editData?.customerType}>{editData?.customerType}</option>
                  {["Enterprise", "ISP", "Operator", "Government"].map((e)=><option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition">
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden text-center p-6">
            <div className="mx-auto w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Customer?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to delete <strong>{customer.name}</strong>? This will also deactivate all associated connections. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition">
                Cancel
              </button>
              <button onClick={handleDeleteSubmit} disabled={isSubmitting} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition">
                {isSubmitting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Main Header Card --- */}
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4 border-t-4 ${customer.isActive ? 'border-t-green-500' : 'border-t-red-500'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          
          <div className="flex flex-col gap-1 w-full md:w-auto">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
              
              {/* ACTION BUTTONS (Edit / Delete) */}
              {(user?.role === "admin" || user?.role === "employee") && (
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsEditModalOpen(true)} className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors" title="Edit Customer">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => setIsDeleteModalOpen(true)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Delete Customer">
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
            
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

            <div className="flex md:justify-end flex-col md:flex-row gap-2">
              <button 
                onClick={() => exportConnectionsToExcel(connectionData, customer.name)}
                className="flex items-center gap-2 bg-green-700 justify-center hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95"
              >
                Export {connectionData?.length || 0} Connections
              </button>
              <Link to={"bulk"} className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95">Import Connections</Link>
            </div>

            {customer.createdAt && (
              <div className="text-xs text-gray-400 mt-2">
                Client since {new Date(customer.createdAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Billing & GST Information --- */}
      {billingList.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Billing & GST Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {billingList.map((billing, idx) => (
              <div key={billing._id || billing.label} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col h-full">
                {billing.label && (
                  <h3 className="text-sm font-bold text-gray-800 mb-3 border-b pb-2">{billing.label}</h3>
                )}
                
                <div className="flex flex-col gap-1 mb-3 flex-grow">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">GST Number</span>
                  <span className="font-mono text-sm text-indigo-700 bg-indigo-50 px-2 py-1 rounded inline-block w-fit">
                    {billing.gstNumber || "N/A"}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Billing Address</span>
                  <span className="text-sm text-gray-700 leading-relaxed">
                    {billing.address?.street}<br />
                    {billing.address?.city && billing.address?.state ? `${billing.address.city}, ${billing.address.state}` : ''} 
                    {billing.address?.pincode ? ` - ${billing.address.pincode}` : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- KYC Documents Section --- */}
      {(user?.role == "admin" || user?.role == "owner") && customer?.documents && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">KYC Documents</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Company Documents Column */}
            {customer.documents.companyDocuments?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider border-b pb-2">Company Documents</h3>
                <div className="flex flex-col gap-3">
                  {customer.documents.companyDocuments.map((doc, idx) => (
                    <div key={doc._id || doc.fileName} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
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
                    <div key={doc._id || doc.fileName} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg">
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