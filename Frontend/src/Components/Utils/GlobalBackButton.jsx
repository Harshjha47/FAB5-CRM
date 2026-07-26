import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const GlobalBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/' || location.pathname === '/dashboard' || location.pathname === '/customers/add') {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      aria-label="Go back"
      className="group fixed top-5 left-5 z-50 flex items-center gap-2 px-4 py-2
                 rounded-2xl text-sm font-semibold text-slate-800
                 bg-gradient-to-br from-white/80 via-blue-50/60 to-indigo-100/50
                 backdrop-blur-md
                 border border-white/60
                 shadow-[0_4px_16px_rgba(99,102,241,0.15),0_1px_2px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(99,102,241,0.1)]
                 transition-all duration-300 ease-out
                 hover:shadow-[0_6px_20px_rgba(99,102,241,0.25),inset_0_1px_1px_rgba(255,255,255,1)]
                 hover:border-white/80
                 active:scale-95
                 overflow-hidden isolate opacity-30 hover:opacity-100"
    >
      {/* liquid shine sweep */}
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full
                   group-hover:translate-x-full transition-transform duration-700 ease-in-out
                   bg-gradient-to-r from-transparent via-white/60 to-transparent"
      />
      {/* top glass reflection */}
      <span className="pointer-events-none absolute inset-x-1 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/50 to-transparent" />

      <ArrowLeft size={16} className="relative" />
      <span className="relative">Back</span>
    </button>
  );
};

export default GlobalBackButton;