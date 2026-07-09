import React from 'react';

const StatCard = ({ title, icon: Icon, iconColorClass, total, items, summaryItems }) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Icon size={18} className={iconColorClass} /> {title}
        </h3>
        <span className="text-xl font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">{total}</span>
      </div>

      <div className="space-y-3 flex-1">
        {/* Highlighted Top Metrics */}
        {items.map((item, index) => (
          <div key={index} className={`flex items-center justify-between p-2.5 rounded-lg border ${item.bgClass} ${item.borderClass}`}>
            <span className={`flex items-center gap-2 text-sm font-medium ${item.textClass}`}>
              {item.icon && <item.icon size={16} className={item.iconColor} />}
              {item.label}
            </span>
            <span className={`font-bold ${item.valueClass}`}>{item.value}</span>
          </div>
        ))}

        {/* Bottom Detailed Metrics */}
        {summaryItems && summaryItems.length > 0 && (
          <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
            {summaryItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <item.icon size={14} className="text-slate-400" /> {item.label}
                </span>
                <span className="font-bold text-slate-700">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;