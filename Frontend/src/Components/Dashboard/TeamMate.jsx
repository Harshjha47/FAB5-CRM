import React from 'react'
import { 
  User, Mail, Phone, Calendar, 
  Fingerprint, CreditCard, Shield, Clock 
} from 'lucide-react';

const TeamMate = () => {
    
  const userData = {
    name: "Harsh Jha",
    email: "harshjha.00004@gmail.com",
    phone: "+91 87004 06878",
    role: "employee",
    dob: "2004-02-12T00:00:00.000Z",
    adharNumber: "1234567890",
    panNumber: "0987654321",
    id: "69872f1a9c5dc90af43ad32a",
    createdAt: "2026-02-07T12:24:58.507Z",
    updatedAt: "2026-02-07T12:25:52.481Z"
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="h-[90vh] border bg-gray-50 p-8 flex overflow-auto justify-center">
      <div className="max-w-2xl border w-full customScroller bg-white rounded-2xl shadow-sm overflow-auto  border-gray-200 ">
        
        {/* Header / Banner Area */}
        <div className="bg-blue-600 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30">
              <User size={40} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              <span className="inline-block px-3 py-1 bg-blue-500 rounded-full text-xs font-semibold uppercase tracking-wider mt-1">
                {userData.role}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Section: Personal Info */}
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Contact Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={<Mail size={18}/>} label="Email" value={userData.email} />
              <InfoItem icon={<Phone size={18}/>} label="Phone" value={userData.phone} />
              <InfoItem icon={<Calendar size={18}/>} label="Date of Birth" value={formatDate(userData.dob)} />
            </div>
          </div>

          {/* Section: Identification */}
          <div className="pt-6 border-t border-gray-100">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Identification</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={<Fingerprint size={18}/>} label="Aadhar Number" value={userData.adharNumber} />
              <InfoItem icon={<CreditCard size={18}/>} label="PAN Number" value={userData.panNumber} />
            </div>
          </div>

          {/* Section: System Data */}
          <div className="pt-6 border-t border-gray-100 bg-gray-50 -mx-6 px-6 pb-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4 pt-4">System Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2"><Shield size={14}/> User ID</span>
                <span className="font-mono text-gray-700">{userData.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2"><Clock size={14}/> Created</span>
                <span className="text-gray-700">{formatDate(userData.createdAt)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Reusable sub-component for info rows
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="text-blue-600 mt-1">{icon}</div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-gray-900 font-medium">{value}</p>
    </div>
  </div>
);

export default TeamMate