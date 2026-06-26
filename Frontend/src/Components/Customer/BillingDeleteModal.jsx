import React from "react";
import { AlertTriangle } from "lucide-react";

function BillingDeleteModal({ profileLabel, isSubmitting, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden text-center p-6 border-t-4 border-t-red-500">
        <div className="mx-auto w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={28} />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Billing Profile?</h3>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Are you sure you want to delete the billing profile <strong>{profileLabel || "this profile"}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={onConfirm} 
            disabled={isSubmitting} 
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 transition"
          >
            {isSubmitting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BillingDeleteModal;