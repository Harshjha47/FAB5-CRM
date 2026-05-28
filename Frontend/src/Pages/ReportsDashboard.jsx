import React, { useEffect, useMemo, useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Activity, 
  Users, 
  FileBarChart, 
  IndianRupee, 
  Wifi, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Building2,
  Server,
  Globe,
  Briefcase,
  Landmark,
  XCircle,
  Wallet,
  Lock,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';
import { useConnection } from '../Context/ConnectionContext';
import { generateRoleBasedReport } from '../Services/ReportExportService';

const ReportsDashboard = () => {
  const { allData, user, loading } = useAuth();
  const { projectReportData } = useConnection();
  
  const [isExporting, setIsExporting] = useState(false);
  const [pmData, setPmData] = useState(null);
  const [pmLoading, setPmLoading] = useState(false);

  // --- ACCESS CONTROL DEFINITIONS ---
  const isProjectManager = user?.role === 'project_manager';
  const isRestrictedRole = user?.role === 'owner' || user?.role === 'order_generation';

  // --- FETCH PROJECT MANAGER DATA ---
  useEffect(() => {
    if (isProjectManager || user?.role === 'admin') {
      const fetchPMData = async () => {
        setPmLoading(true);
        try {
          const {data} = await projectReportData();
          
          // Extract connections safely whether the API returns { connections: [...] } or just an array
          const connectionsArray = Array.isArray(data) ? data : (data?.connections || data?.data || []);

          setPmData(connectionsArray);
        } catch (error) {
          console.error("Failed to fetch PM report data", error);
          toast.error("Failed to load project manager data");
        } finally {
          setPmLoading(false);
        }
      };
      fetchPMData();
    }
  }, [isProjectManager, projectReportData]);

          console.log(pmData)


  // --- CALCULATE DEEP SUMMARY METRICS BASED ON SCHEMAS ---
  const summary = useMemo(() => {
    // 1. Verify Data Readiness based on Role
    if (isProjectManager && !pmData) return null; // Wait for PM data
    if (!isProjectManager && (!allData || !allData.connections)) return null; // Wait for All data

    // 2. Select the correct data source
    const customers = isProjectManager ? [] : (allData.customers || []);
    const connections = isProjectManager ? pmData : (allData.connections || []);

    // 3. CUSTOMER METRICS (Will be 0 for PM, which is fine since the card is hidden)
    const activeCustomers = customers.filter(c => c.isActive).length;
    const inactiveCustomers = customers.length - activeCustomers;
    const typeCounts = {
      enterprise: customers.filter(c => c.customerType === 'Enterprise').length,
      isp: customers.filter(c => c.customerType === 'ISP').length,
      operator: customers.filter(c => c.customerType === 'Operator').length,
      government: customers.filter(c => c.customerType === 'Government').length,
    };

    // 4. CONNECTION PIPELINE METRICS
    const activeConns = connections.filter(c => c.status === 'Active').length;
    const pendingConns = connections.filter(c => ['Pending', 'Approved', 'Generation'].includes(c.status)).length;
    const noticeConns = connections.filter(c => c.status === 'Notice Period').length;
    const churnedConns = connections.filter(c => ['Disconnected', 'Rejected', 'Cancelled', 'Deleted'].includes(c.status)).length;

    // 5. REVENUE & TECHNICAL METRICS (Only counting Active & Notice Period)
    const liveConnections = connections.filter(c => c.status === 'Active' || c.status === 'Notice Period');
    
    // Revenue
    const totalMRC = liveConnections.reduce((acc, curr) => acc + Number(curr.commercials?.mrc || 0), 0);
    const totalIPCost = liveConnections.reduce((acc, curr) => acc + Number(curr.ips?.cost || 0), 0);
    const totalLiveRevenue = totalMRC + totalIPCost;
    
    // One Time Collections
    const validFinancialConns = connections.filter(c => !['Rejected', 'Deleted', 'Cancelled'].includes(c.status));
    const totalOTC = validFinancialConns.reduce((acc, curr) => acc + Number(curr.commercials?.otc || 0), 0);
    const totalAdvance = validFinancialConns.reduce((acc, curr) => acc + Number(curr.commercials?.advance || 0), 0);

    // Technical
    const totalBandwidth = liveConnections.reduce((acc, curr) => acc + Number(curr.bandwidth || 0), 0);
    const totalIPsAllocated = liveConnections.reduce((acc, curr) => acc + Number(curr.ips?.count || 0), 0);

    return {
      customers: { total: customers.length, active: activeCustomers, inactive: inactiveCustomers, ...typeCounts },
      connections: { total: connections.length, active: activeConns, pending: pendingConns, notice: noticeConns, churned: churnedConns },
      revenue: { totalLiveRevenue, totalMRC, totalIPCost, totalOTC, totalAdvance, totalBandwidth, totalIPsAllocated }
    };
  }, [allData, pmData, isProjectManager]);

  const formatCurrency = (val) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);

  const handleMasterExport = async () => {
    if (!summary) {
      toast.error("Data is still loading. Please wait.");
      return;
    }

    setIsExporting(true);
    const tid = toast.loading("Generating Excel Report...");
    
    try {
      setTimeout(() => {
        // Feed the correct data to the export function based on role
        const exportCustomers = isProjectManager ? [] : (allData.customers || []);
        const exportConnections = isProjectManager ? pmData : (allData.connections || []);
        
        generateRoleBasedReport(exportCustomers, exportConnections, user?.role);
        toast.success("Report Downloaded Successfully!", { id: tid });
        setIsExporting(false);
      }, 500);
    } catch (error) {
      console.error("Export Error:", error);
      toast.error("Failed to generate report.", { id: tid });
      setIsExporting(false);
    }
  };

  // Wait for either the global Auth data or the specific PM data to finish loading
  if (loading || pmLoading || !summary) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // --- STRICT ROLE BLOCKING FOR RESTRICTED ROLES ---
  if (isRestrictedRole) {
    return (
      <div className="flex-1 min-h-[70vh] flex flex-col items-center justify-center p-8 bg-slate-50/50 text-center">
        <div className="bg-red-100 text-red-500 p-6 rounded-full mb-6">
          <Lock size={48} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Access Restricted</h2>
        <p className="text-slate-500 max-w-md">
          Your current role (<span className="font-bold capitalize">{user?.role.replace('_', ' ')}</span>) does not have clearance to view or generate system reports.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-[70vh] p-4 md:p-8 bg-slate-50/50">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <FileBarChart className="text-indigo-600" size={32} />
            Reports & Analytics
          </h1>
          <p className="text-slate-500 mt-2">Generate exports and view real-time database summaries based on your clearance level.</p>
        </div>

        {/* TOP ROW: Export & High-Level Snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Master Report Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <FileSpreadsheet size={28} />
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {user?.role.replace('_', ' ')} Access
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-2">Master Database Report</h3>
            <p className="text-slate-500 text-sm mb-6 flex-1">
              Complete export of all records in a single Excel file. Columns are filtered based on your clearance level.
              {isProjectManager && (
                <span className="text-amber-600 font-semibold block mt-2">
                  <EyeOff size={14} className="inline mr-1 mb-0.5"/>
                  Financial and pricing data have been excluded.
                </span>
              )}
            </p>

            <button 
              onClick={handleMasterExport}
              disabled={isExporting}
              className={`w-full py-3.5 rounded-xl font-bold text-white shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 
                ${isExporting ? 'bg-indigo-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
            >
              <Download size={18} />
              {isExporting ? 'Formatting Excel...' : 'Download Master Report (.xlsx)'}
            </button>
          </div>

          {/* Revenue & Tech Snapshot */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-md border border-slate-700 text-white flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Activity size={120} />
            </div>
            
            <h3 className="text-lg font-bold text-slate-300 mb-6 border-b border-slate-700 pb-4 relative z-10">
              {isProjectManager ? "Infrastructure Overview" : "Live Infrastructure & Revenue"}
            </h3>
            
            <div className={`grid gap-6 relative z-10 ${isProjectManager ? 'grid-cols-1' : 'grid-cols-2'}`}>
              
              {!isProjectManager && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-slate-400 font-medium">
                    <IndianRupee size={18} className="text-emerald-400"/> Total Live MRR
                  </div>
                  <span className="text-3xl lg:text-4xl font-black text-emerald-50">{formatCurrency(summary.revenue.totalLiveRevenue)}</span>
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-400 font-medium">
                  <Wifi size={18} className="text-blue-400"/> Total Bandwidth
                </div>
                <span className="text-3xl lg:text-4xl font-black text-blue-50">{summary.revenue.totalBandwidth.toLocaleString('en-IN')} <span className="text-lg font-medium text-slate-400">Mbps</span></span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-6 italic">
              * Includes Active and Notice Period connections.
            </p>
          </div>
        </div>

        {/* BOTTOM ROW: Detailed Summaries */}
        <div className={`grid gap-6 ${isProjectManager ? 'grid-cols-1 max-w-md mx-auto w-full' : 'grid-cols-1 md:grid-cols-3'}`}>
          
          {/* 1. Customer Demographics Card - HIDDEN FOR PM */}
          {!isProjectManager && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Users size={18} className="text-blue-500" /> Customer Base
                </h3>
                <span className="text-xl font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">{summary.customers.total}</span>
              </div>
              
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                  <span className="text-sm font-medium text-emerald-800">Active Accounts</span>
                  <span className="font-bold text-emerald-600">{summary.customers.active}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-rose-50 rounded-lg border border-rose-100">
                  <span className="text-sm font-medium text-rose-800">Inactive Accounts</span>
                  <span className="font-bold text-rose-500">{summary.customers.inactive}</span>
                </div>
                
                <div className="pt-3 mt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600"><Building2 size={14} className="text-slate-400"/> Enterprise</span>
                    <span className="font-bold text-slate-700">{summary.customers.enterprise}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600"><Globe size={14} className="text-slate-400"/> ISP</span>
                    <span className="font-bold text-slate-700">{summary.customers.isp}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600"><Briefcase size={14} className="text-slate-400"/> Operator</span>
                    <span className="font-bold text-slate-700">{summary.customers.operator}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600"><Landmark size={14} className="text-slate-400"/> Government</span>
                    <span className="font-bold text-slate-700">{summary.customers.government}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Connection Pipeline Card - VISIBLE TO ALL */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Activity size={18} className="text-indigo-500" /> Inventory State
              </h3>
              <span className="text-xl font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">{summary.connections.total}</span>
            </div>
            
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between p-2.5 bg-indigo-50 rounded-lg border border-indigo-100">
                <span className="flex items-center gap-2 text-sm font-medium text-indigo-800"><CheckCircle2 size={16} className="text-indigo-500"/> Live / Active</span>
                <span className="font-bold text-indigo-600">{summary.connections.active}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-lg border border-amber-100">
                <span className="flex items-center gap-2 text-sm font-medium text-amber-800"><Clock size={16} className="text-amber-500"/> In Pipeline (WIP)</span>
                <span className="font-bold text-amber-600">{summary.connections.pending}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-orange-50 rounded-lg border border-orange-100">
                <span className="flex items-center gap-2 text-sm font-medium text-orange-800"><AlertCircle size={16} className="text-orange-500"/> Notice Period</span>
                <span className="font-bold text-orange-600">{summary.connections.notice}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700"><XCircle size={16} className="text-slate-400"/> Disconnected/Lost</span>
                <span className="font-bold text-slate-600">{summary.connections.churned}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-sky-50 rounded-lg border border-sky-100 mt-2">
                <span className="flex items-center gap-2 text-sm font-medium text-sky-800"><Server size={16} className="text-sky-500"/> Total IPs Allocated</span>
                <span className="font-bold text-sky-600">{summary.revenue.totalIPsAllocated}</span>
              </div>
            </div>
          </div>

          {/* 3. Financial Collections Card - HIDDEN FOR PM */}
          {!isProjectManager && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Wallet size={18} className="text-emerald-500" /> Financial Overview
                </h3>
              </div>
              
              <div className="space-y-4 flex-1">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Base MRC (No IPs)</span>
                  <span className="text-lg font-bold text-slate-700">{formatCurrency(summary.revenue.totalMRC)} <span className="text-xs font-normal text-slate-400">/mo</span></span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">IP Address Revenue</span>
                  <span className="text-lg font-bold text-slate-700">{formatCurrency(summary.revenue.totalIPCost)} <span className="text-xs font-normal text-slate-400">/mo</span></span>
                </div>

                <div className="w-full h-px bg-slate-100 my-2"></div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total OTC Generated</span>
                  <span className="text-lg font-bold text-slate-700">{formatCurrency(summary.revenue.totalOTC)}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Advance Collected</span>
                  <span className="text-lg font-bold text-slate-700">{formatCurrency(summary.revenue.totalAdvance)}</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default ReportsDashboard;