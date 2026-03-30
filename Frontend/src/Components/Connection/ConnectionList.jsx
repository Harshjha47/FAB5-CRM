import React from 'react';
import { Link, useParams } from 'react-router-dom';

const ConnectionList = ({ connections }) => {
  // --- Formatting Helpers ---
  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { 
    style: 'currency', currency: 'INR', maximumFractionDigits: 0 
  }).format(val || 0);
  const {id}=useParams()
  
  const formatDate = (date) => date ? new Date(date).toLocaleDateString('en-IN') : '-';

  // --- Status Badge Styling ---
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Approved': case 'Generation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Notice Period': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Disconnected': case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Pending
    }
  };

  // --- Empty State ---
  if (!connections || connections.length === 0) {
    return (
      <div className="p-10 text-center bg-white rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500 font-medium">No connections found.</p>
        <p className="text-sm text-gray-400 mt-1">Adjust your filters or create a new connection.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-auto">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          
          {/* Table Header */}
          <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] font-bold tracking-wider border-b">
            <tr>
              <th className="p-4">Circuit ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Service & Route</th>
              <th className="p-4">Bandwidth</th>
              <th className="p-4">MRC</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="text-sm divide-y divide-gray-100">
            {connections.map((conn) => (
              
              <tr key={conn._id} className="hover:bg-indigo-50/30 transition-colors">
                
                {/* ID Column */}
                <td className="p-4 font-mono text-indigo-600 font-medium">
                  {conn.fabCircuitId || conn.opportunityId || 'Pending...'}
                </td>
                
                {/* Customer Column */}
                <td className="p-4">
                  <p className="font-semibold text-gray-900">{conn?.customer?.name || 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{formatDate(conn.createdAt)}</p>
                </td>
                
                {/* Service Column */}
                <td className="p-4">
                  <p className="font-medium text-gray-800">{conn.serviceType}</p>
                  <p className="text-xs text-gray-500">{conn.technicalDetails?.telcoProvider || 'No Provider'}</p>
                </td>
                
                {/* Bandwidth Column */}
                <td className="p-4 font-medium text-gray-700">
                  {conn.bandwidth} Mbps
                </td>
                
                {/* Commercials Column */}
                <td className="p-4">
                  <p className="font-medium text-green-700">{formatCurrency(conn.commercials?.mrc)}</p>
                  {conn.commercials?.otc > 0 && (
                    <p className="text-[10px] text-gray-400">OTC: {formatCurrency(conn.commercials.otc)}</p>
                  )}
                </td>
                
                {/* Status Column */}
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadge(conn.status)}`}>
                    {conn.status}
                  </span>
                </td>
                
                {/* Actions Column */}
                <td className="p-4 text-center">
                  <Link 
                    to={`/customer/${id || 'unknown'}/connection/${conn._id}/history`} 
                    className="inline-block border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 font-semibold px-4 py-1.5 rounded-md text-xs transition-all"
                  >
                    View Details
                  </Link>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConnectionList;