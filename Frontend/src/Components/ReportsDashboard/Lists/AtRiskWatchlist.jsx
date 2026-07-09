import React from 'react';
import { AlertTriangle, ShieldCheck, Ticket, Network } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const AtRiskWatchlist = ({ data, isPM }) => {
  const { connections = [], totalRiskMRR = 0 } = data || {};
  const hasRisks = connections.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-2">
      <div className="hidden lg:block lg:col-span-3 bg-slate-50/50 rounded-2xl">
        <div className="bg-white rounded-2xl p-0 shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden relative">
          
          {/* Header Section */}
          <div className={`p-6 border-b ${hasRisks ? 'bg-rose-50/50 border-rose-100' : 'bg-emerald-50/50 border-emerald-100'}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  {hasRisks ? (
                    <AlertTriangle size={20} className="text-rose-500" />
                  ) : (
                    <ShieldCheck size={20} className="text-emerald-500" />
                  )}
                  "At Risk" Watchlist
                </h3>
                <p className="text-sm text-slate-500 mt-1">Circuits currently in Notice Period.</p>
              </div>

              {/* Only show Total Risk MRR if NOT a project manager and risks exist */}
              {!isPM && hasRisks && (
                <div className="text-right bg-white px-4 py-2 rounded-xl shadow-sm border border-rose-100">
                  <span className="block text-xs font-bold text-rose-400 uppercase tracking-wider mb-0.5">Total MRR at Risk</span>
                  <span className="text-lg font-black text-rose-600">{formatCurrency(totalRiskMRR)}</span>
                </div>
              )}
            </div>
          </div>

          {/* List Section */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            {hasRisks ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connections.map((conn) => (
                  <div key={conn.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-rose-300 transition-colors shadow-sm relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-400 group-hover:bg-rose-500 transition-colors"></div>
                    <h4 className="font-bold text-slate-800 truncate mb-1" title={conn.customerName}>
                      {conn.customerName}
                    </h4>

                    <div className="flex flex-col gap-1.5 mt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Ticket size={14} className="text-slate-400" /> Circuit ID
                        </span>
                        <span className="font-mono font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{conn.circuitId}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Network size={14} className="text-slate-400" /> Bandwidth
                        </span>
                        <span className="font-medium text-slate-700">{conn.bandwidth}Mbps</span>
                      </div>

                      {!isPM && (
                        <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-100">
                          <span className="font-bold text-slate-400 uppercase">Impact</span>
                          <span className="font-bold text-rose-600">{formatCurrency(conn.revenue)}/mo</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck size={32} />
                </div>
                <h4 className="text-lg font-bold text-slate-800">System is Secure</h4>
                <p className="text-sm text-slate-500 max-w-sm mt-2">
                  There are currently zero circuits in the notice period pipeline. No immediate retention actions required.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtRiskWatchlist;