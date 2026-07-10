import React from 'react';
import { AlertTriangle, ShieldCheck, Ticket, Network } from 'lucide-react';

// Inline currency formatter to prevent missing import errors
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);
};

const AtRiskWatchlist = ({ data, isPM }) => {
  const { connections = [], totalRiskMRR = 0 } = data || {};
  const hasRisks = connections.length > 0;

  return (
    <div className="lg:col-span-1 bg-white rounded-2xl p-6 max-h-[60vh] overflow-y-auto shadow-sm border border-slate-200 flex flex-col h-full">
      <div className="flex items-start justify-between mb-6">
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
          <div className="text-right">
            <span className="block text-xs font-bold text-rose-400 uppercase tracking-wider mb-0.5">Total Risk</span>
            <span className="text-lg font-black text-rose-600">{formatCurrency(totalRiskMRR)}</span>
          </div>
        )}
      </div>

      <div className="space-y-4 flex-1">
        {hasRisks ? (
          connections.map((conn) => (
            <div
              key={conn.id}
              className="flex items-center gap-4 p-3 rounded-xl border transition-all hover:shadow-md bg-rose-50/30 border-rose-100 hover:border-rose-300"
            >
              {/* Icon Badge */}
              <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold shadow-sm bg-white text-rose-500 border border-rose-200">
                <AlertTriangle size={18} />
              </div>

              {/* Client Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 truncate" title={conn.customerName}>
                  {conn.customerName}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Ticket size={12} className="text-slate-400" /> 
                    <span className="font-mono bg-white px-1 py-0.5 rounded border border-slate-100">{conn.circuitId}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Network size={12} className="text-slate-400" /> {conn.bandwidth}Mbps
                  </span>
                </div>
              </div>

              {/* Revenue Info */}
              {!isPM && (
                <div className="text-right shrink-0">
                  <span className="block font-black text-rose-600">
                    {formatCurrency(conn.revenue)}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">/mo</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck size={32} />
            </div>
            <h4 className="text-lg font-bold text-slate-800">System is Secure</h4>
            <p className="text-sm text-slate-500 mt-2">
              No circuits in notice period.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AtRiskWatchlist;