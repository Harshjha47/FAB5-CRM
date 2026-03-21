import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const QuickActions = ({ status, userRole, onApprove, onReject, onGenerate, onActivate }) => {
  // State for the Project Manager's Circuit ID input
  const currentDate = new Date();
  
  const [circuitId, setCircuitId] = useState({ telecoCircuitId:"", acceptanceDate:currentDate });
  const {id,cid}=useParams()

  const handleChange =(e)=>{
    const {name,value}=e.target
    setCircuitId({...circuitId,[name]:value})

  }
//   { telecoCircuitId, acceptanceDate }

  // 1. OWNER ACTIONS: Approve or Reject a Pending connection
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

  // 2. ORDER GENERATION ACTIONS: Move from Approved to Generation
  if (status === 'Approved' && (userRole === 'order_generation' || userRole === 'admin')) {
    return (
      <button onClick={onGenerate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold shadow transition">
        Generate Order
      </button>
    );
  }

  // 3. PROJECT MANAGER ACTIONS: Enter ID and Activate
  if (status === 'Generation' && (userRole === 'project_manager' || userRole === 'admin')) {
    return (
      <div className="flex items-center gap-2 bg-white p-1 pr-2 border rounded-md shadow-sm">
        <input 
          type="text" 
          placeholder="Enter Teleco Circuit ID..." 
          name="telecoCircuitId"
          className="px-3 py-1.5 text-sm outline-none w-48 bg-transparent"
          value={circuitId.telecoCircuitId}
          onChange={handleChange}
        />
        <button 
          onClick={() => onActivate(circuitId)}
          disabled={!circuitId.telecoCircuitId?.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-3 py-1.5 rounded text-sm font-semibold transition"
        >
          Activate
        </button>
      </div>
    );
  }

  // 4. EMPLOYEE ACTIONS: Employees create connections elsewhere, but can edit pending ones
  if ( userRole === 'employee') {
    return (
      <Link to={`/customer/${id}/connection/${cid}/manage`} className="bg-white border hover:bg-gray-50 text-gray-700 px-4 py-2 rounded text-sm font-semibold shadow-sm transition">
        Edit Record
      </Link>
    );
  }

  // Default: Return nothing if they don't have permission for the current state
  return null;
};

export default QuickActions;