import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CancelOrder from './CancelOrder';

const QuickActions = ({ status, userRole, onApprove, onReject, onGenerate, onActivate, onCancel }) => {
  const [circuitId, setCircuitId] = useState({ 
    telecoCircuitId: "", 
    acceptanceDate: new Date().toISOString().split('T')[0] 
  });
  
  const { id, cid } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCircuitId({ ...circuitId, [name]: value });
  };

  // 1. OWNER ACTIONS
  if (status === 'Pending' && (userRole === 'owner' || userRole === 'admin')) {
    return (
      <div className="flex gap-2">
        <button onClick={onReject} className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 px-4 py-2 rounded text-sm font-semibold transition">
          Reject
        </button>
        <button onClick={onApprove} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold shadow transition">
          Approve Connection
        </button>
      </div>
    );
  }

  // 2. ORDER GENERATION ACTIONS
  if (status === 'Approved' && (userRole === 'order_generation' || userRole === 'admin')) {
    return (
      <button onClick={onGenerate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold shadow transition">
        Generate Order
      </button>
    );
  }

  // 3. PROJECT MANAGER ACTIONS
  if (status === 'Generation' && (userRole === 'project_manager' || userRole === 'admin')) {
    return (
      <div className="flex flex-col md:flex-row items-center gap-2 bg-white p-2 border rounded-md shadow-sm">
        <button className="bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 px-4 py-2 rounded text-sm font-semibold transition">
          <CancelOrder/>
        </button>
        <div className="flex flex-col">
          <label className="text-[10px] uppercase text-gray-500 font-bold px-1">Circuit ID</label>
          <input 
            type="text" 
            placeholder="Enter ID..." 
            name="telecoCircuitId"
            className="px-3 py-1.5 text-sm outline-none w-40 bg-transparent border-b md:border-none"
            value={circuitId.telecoCircuitId}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col border-l pl-2">
          <label className="text-[10px] uppercase text-gray-500 font-bold px-1">Acceptance Date</label>
          <input 
            type="date" 
            name="acceptanceDate"
            className="px-3 py-1.5 text-sm outline-none bg-transparent"
            value={circuitId.acceptanceDate}
            onChange={handleChange}
            required
          />
        </div>

        <button 
          onClick={() => onActivate(circuitId)}
          disabled={!circuitId.telecoCircuitId?.trim() || !circuitId.acceptanceDate}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-4 py-2 rounded text-sm font-semibold transition ml-auto"
        >
          Activate
        </button>
      </div>
    );
  }

  // 4. EMPLOYEE ACTIONS
  if (userRole === 'employee' || userRole === 'admin') {
    // Prevent any actions if the order was cancelled
    if (status === 'Cancelled' || status === 'Canceled') {
      return null;
    }

    if (status === "Rejected" || status === "Pending") {
      return (
        <Link to={`/customer/${id}/connection/${cid}/edit`} className="bg-white border hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-semibold shadow-sm transition">
          Edit
        </Link>
      );
    } else if(status != "Rejected" && status != "Pending") {
      return (
        <Link to={`/customer/${id}/connection/${cid}/manage`} className="bg-white border hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-semibold shadow-sm transition">
          MACD
        </Link>
      );
    }
  }

  return null;
};

export default QuickActions;