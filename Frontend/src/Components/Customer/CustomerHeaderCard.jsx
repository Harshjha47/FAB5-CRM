import React from "react";
import { Link } from "react-router-dom";
import { Edit2, Trash2 } from "lucide-react";

function CustomerHeaderCard({ customer, user, connectionCount, onEditClick, onDeleteClick, onExport }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 border-t-4 ${customer.isActive ? 'border-t-green-500' : 'border-t-red-500'}`}>
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        
        <div className="flex flex-col gap-1 w-full md:w-auto">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
            
            {(user?.role === "admin" || user?.role === "employee") && (
              <div className="flex items-center gap-2">
                <button onClick={onEditClick} className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors" title="Edit Customer">
                  <Edit2 size={18} />
                </button>
                <button onClick={onDeleteClick} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Delete Customer">
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
              onClick={onExport}
              className="flex items-center gap-2 bg-green-700 justify-center hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95"
            >
              Export {connectionCount} Connections
            </button>
            <Link to="bulk" className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95">Import Connections</Link>
          </div>

          {customer.createdAt && (
            <div className="text-xs text-gray-400 mt-2">
              Client since {new Date(customer.createdAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerHeaderCard;