import React from 'react';

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Hero & Quick Contact */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-8 text-white flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Fab5 Connect Support</h1>
            <p className="text-blue-100 text-lg">Internal Helpdesk & Employee Resources</p>
          </div>
          <a 
            href="mailto:support@fab5network.com" 
            className="mt-6 md:mt-0 bg-white text-blue-700 font-bold py-3 px-6 rounded-lg shadow hover:bg-gray-50 transition flex items-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            support@fab5network.com
          </a>
        </div>

        {/* 3-Step Support Process */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Support Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-semibold text-gray-800">Identify Issue</h3>
              <p className="text-sm text-gray-500 mt-2">Note the bug or feature request you need help with.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl relative">
              <div className="hidden md:block absolute top-1/2 -left-3 w-6 h-0.5 bg-gray-300"></div>
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-semibold text-gray-800">Email Support</h3>
              <p className="text-sm text-gray-500 mt-2">Send details to our dedicated support email.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl relative">
              <div className="hidden md:block absolute top-1/2 -left-3 w-6 h-0.5 bg-gray-300"></div>
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-semibold text-gray-800">24h Resolution</h3>
              <p className="text-sm text-gray-500 mt-2">SLA guarantees a response within 1 business day.</p>
            </div>
          </div>
        </div>

        {/* Account Management Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Credentials & Access */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-blue-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Access & Credentials</h2>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <span><strong>SSO Login:</strong> Uses standard Fab5 employee credentials.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <span><strong>Auto-Provisioned:</strong> New accounts created on onboarding.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-yellow-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <span><strong>Escalation:</strong> Managers must email support for Admin rights.</span>
              </li>
            </ul>
          </div>

          {/* Account Deletion */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 border-l-4 border-l-red-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 rounded-lg text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Account Deletion</h2>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                <span><strong>No Manual Deletion:</strong> Active accounts cannot be deleted arbitrarily due to compliance.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <span><strong>HR Offboarding:</strong> Access is revoked immediately upon departure.</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span><strong>Data Removal:</strong> Email support with subject <em>"Account Deletion Request"</em> to remove non-essential profile data.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Terms Box */}
          <div className="bg-gray-800 text-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Terms & Conditions
            </h2>
            <div className="space-y-3 text-sm text-gray-300">
              <p className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">■</span>
                <strong>Authorized Use:</strong> Official Fab5 business only. No personal use.
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">■</span>
                <strong>Confidentiality:</strong> Do not share CRM data externally.
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">■</span>
                <strong>Integrity:</strong> Keep all entered data accurate and professional.
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">■</span>
                <strong>Monitoring:</strong> Activity is monitored for security compliance.
              </p>
            </div>
          </div>

          {/* Privacy Box */}
          <div className="bg-gray-800 text-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Privacy Policy
            </h2>
            <div className="space-y-3 text-sm text-gray-300">
              <p className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✔</span>
                <strong>Collection:</strong> We log IPs, access times, and record changes.
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✔</span>
                <strong>Usage:</strong> Data is used strictly for troubleshooting and workflow.
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✔</span>
                <strong>Sharing:</strong> Internal only. Never sold or shared externally.
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✔</span>
                <strong>Security:</strong> All data is encrypted and role-restricted.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SupportPage;