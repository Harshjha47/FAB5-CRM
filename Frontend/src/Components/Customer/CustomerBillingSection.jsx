import React from "react";
import { Edit2, Trash2, Plus, MapPin } from "lucide-react";

function CustomerBillingSection({ billingList, onAddClick, onEditClick, onDeleteClick, userRole }) {
  const canManage = userRole === "admin" || userRole === "employee";
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <MapPin size={20} className="text-indigo-600" /> Billing & GST Details
        </h2>
        {canManage && (
          <button
            onClick={onAddClick}
            className="flex items-center gap-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
          >
            <Plus size={14} /> Add Profile
          </button>
        )}
      </div>

      {billingList.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          No billing profiles configured for this customer.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {billingList.map((billing, idx) => (
            <div key={billing._id || idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col h-full relative group">

              <div className="flex justify-between items-start border-b pb-2 mb-3">
                <h3 className="text-sm font-bold text-gray-800 truncate max-w-[70%]">
                  {billing.label || `Profile #${idx + 1}`}
                </h3>
                {canManage && (
                  <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditClick(billing)}
                      className="text-indigo-600 p-1 hover:bg-indigo-50 rounded"
                      title="Edit Profile"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteClick(billing)} 
                      className="text-red-600 p-1 hover:bg-red-50 rounded"
                      title="Remove Profile"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1 mb-3 flex-grow">
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">GST Number</span>
                <span className="font-mono text-sm text-indigo-700 bg-indigo-50 px-2 py-1 rounded inline-block w-fit uppercase">
                  {billing.gstNumber || "N/A"}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Billing Address</span>
                <span className="text-sm text-gray-700 leading-relaxed truncate-3-lines">
                  {billing.address?.street}<br />
                  {billing.address?.city && billing.address?.state ? `${billing.address.city}, ${billing.address.state}` : ''}
                  {billing.address?.pincode ? ` - ${billing.address.pincode}` : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomerBillingSection;