import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const GlobalBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show the back button on the home/dashboard page
  if (location.pathname === '/' || location.pathname === '/dashboard'||location.pathname === '/customers/add') {
    return null; 
  }

  return (
    <button 
    type="button"
      onClick={() => navigate(-1)} 
      aria-label="Go back"
      className="fixed top-5 left-5 z-50 flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-black text-sm font-semibold rounded-lg shadow-md transition-all active:scale-95"
    >
      <ArrowLeft size={16} />
      Back
    </button>
  );
};

export default GlobalBackButton;