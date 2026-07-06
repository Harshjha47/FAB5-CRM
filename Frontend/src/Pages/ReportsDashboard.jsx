import React, { useEffect, useMemo, useState } from 'react';
import {
  FileSpreadsheet, AlertTriangle,
  ShieldCheck, ArrowRightLeft,
  Ticket, Download, Activity, Users, FileBarChart, IndianRupee, Wifi, CheckCircle2, Clock, AlertCircle, Building2, Server, Globe, Briefcase, Landmark, XCircle, Wallet, Lock, EyeOff, TrendingUp, Calendar, Network, MapPin, Crown, Building
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';
import { useConnection } from '../Context/ConnectionContext';
import { generateRoleBasedReport } from '../Services/ReportExportService';
import {
  LineChart, ReferenceLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell, BarChart,
  Bar,
  LabelList
} from 'recharts';

// --- CONFIGURATION & FORMATTERS ---
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});
const formatCurrency = (val) => currencyFormatter.format(val || 0);

const DONUT_COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#64748b'];

const ReportsDashboard = () => {
  // 1. ALL HOOKS MUST BE DECLARED AT THE TOP
  const { allData, user, loading } = useAuth();
  const { projectReportData } = useConnection();

  const [isExporting, setIsExporting] = useState(false);
  const [pmData, setPmData] = useState(null);
  const [pmLoading, setPmLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('month');

  // --- ACCESS CONTROL DEFINITIONS ---
  const isProjectManager = user?.role === 'project_manager';
  const isAdmin = user?.role === 'admin';
  const isRestrictedRole = user?.role === 'owner' || user?.role === 'order_generation';

  // 2. EFFECT HOOKS
  useEffect(() => {
    if (isProjectManager || isAdmin) {
      const fetchPMData = async () => {
        setPmLoading(true);
        try {
          const { data } = await projectReportData();
          const connectionsArray = Array.isArray(data) ? data : (data?.connections || data?.data || []);
          setPmData(connectionsArray);
        } catch (error) {
        } finally {
          setPmLoading(false);
        }
      };
      fetchPMData();
    }
  }, [isProjectManager, projectReportData]);

  // 3. MEMOIZED DATA CALCULATIONS
  const summary = useMemo(() => {
    if (isProjectManager && !pmData) return null;
    if (!isProjectManager && (!allData || !allData.connections)) return null;

    const customers = isProjectManager ? [] : (allData.customers || []);
    const connections = isProjectManager ? pmData : (allData.connections || []);

    const activeCustomers = customers.filter(c => c.isActive).length;
    const inactiveCustomers = customers.length - activeCustomers;
    const typeCounts = {
      enterprise: customers.filter(c => c.customerType === 'Enterprise').length,
      isp: customers.filter(c => c.customerType === 'ISP').length,
      operator: customers.filter(c => c.customerType === 'Operator').length,
      government: customers.filter(c => c.customerType === 'Government').length,
    };

    const activeConns = connections.filter(c => c.status === 'Active').length;
    const pendingConns = connections.filter(c => ['Pending', 'Approved', 'Generation'].includes(c.status)).length;
    const noticeConns = connections.filter(c => c.status === 'Notice Period').length;
    const churnedConns = connections.filter(c => ['Disconnected', 'Rejected', 'Cancelled', 'Deleted'].includes(c.status)).length;

    const liveConnections = connections.filter(c => c.status === 'Active' || c.status === 'Notice Period');

    const totalMRC = liveConnections.reduce((acc, curr) => acc + Number(curr.commercials?.mrc || 0), 0);
    const totalIPCost = liveConnections.reduce((acc, curr) => acc + Number(curr.ips?.cost || 0), 0);
    const totalLiveRevenue = totalMRC + totalIPCost;

    const validFinancialConns = connections.filter(c => !['Rejected', 'Deleted', 'Cancelled'].includes(c.status));
    const totalOTC = validFinancialConns.reduce((acc, curr) => acc + Number(curr.commercials?.otc || 0), 0);
    const totalAdvance = validFinancialConns.reduce((acc, curr) => acc + Number(curr.commercials?.advance || 0), 0);

    const totalBandwidth = liveConnections.reduce((acc, curr) => acc + Number(curr.bandwidth || 0), 0);
    const totalIPsAllocated = liveConnections.reduce((acc, curr) => acc + Number(curr.ips?.count || 0), 0);

    return {
      customers: { total: customers.length, active: activeCustomers, inactive: inactiveCustomers, ...typeCounts },
      connections: { total: connections.length, active: activeConns, pending: pendingConns, notice: noticeConns, churned: churnedConns },
      revenue: { totalLiveRevenue, totalMRC, totalIPCost, totalOTC, totalAdvance, totalBandwidth, totalIPsAllocated }
    };
  }, [allData, pmData, isProjectManager]);

  const growthAnalytics = useMemo(() => {
    if (!summary) return [];

    const customers = isProjectManager ? [] : (allData.customers || []);
    const connections = isProjectManager ? pmData : (allData.connections || []);
    const dataMap = new Map();

    const formatDate = (dateString) => {
      if (!dateString) return null;
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return null;

      if (timeRange === 'day') return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      if (timeRange === 'month') return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
      if (timeRange === 'year') return d.getFullYear().toString();
    };

    connections.forEach(conn => {
      const key = formatDate(conn.createdAt);
      if (key) {
        if (!dataMap.has(key)) {
          // Changed 'Connections' to 'Revenue'
          dataMap.set(key, { time: key, Revenue: 0, Customers: 0, rawDate: new Date(conn.createdAt) });
        }

        // Calculate revenue for this specific connection
        const mrc = Number(conn.commercials?.mrc || 0);
        const ipCost = Number(conn.ips?.cost || 0);
        const revenue = mrc + ipCost;

        // Add to the total revenue for this time period
        dataMap.get(key).Revenue += revenue;
      }
    });

    customers.forEach(cust => {
      const key = formatDate(cust.createdAt);
      if (key) {
        if (!dataMap.has(key)) {
          dataMap.set(key, { time: key, Revenue: 0, Customers: 0, rawDate: new Date(cust.createdAt) });
        }
        // We leave Customers as a count, since a customer profile itself doesn't have an MRC
        dataMap.get(key).Customers += 1;
      }
    });

    return Array.from(dataMap.values()).sort((a, b) => a.rawDate - b.rawDate);
  }, [allData, pmData, isProjectManager, summary, timeRange]);

  const providerAnalytics = useMemo(() => {
    if (!summary) return [];

    const connections = isProjectManager ? pmData : (allData.connections || []);
    const liveConnections = connections.filter(c => c.status === 'Active' || c.status === 'Notice Period');
    const providerCounts = {};

    liveConnections.forEach(conn => {
      const provider = conn.technicalDetails?.telcoProvider || 'Unknown/Direct';
      providerCounts[provider] = (providerCounts[provider] || 0) + 1;
    });

    return Object.keys(providerCounts)
      .map(key => ({
        name: key,
        value: providerCounts[key]
      }))
      .sort((a, b) => b.value - a.value);
  }, [allData, pmData, isProjectManager, summary]);

  // --- AGGREGATE SLA / TURNAROUND TIME ---
  const slaAnalytics = useMemo(() => {
    if (!summary) return { average: 0, trend: [], validCount: 0 };

    const connections = isProjectManager ? pmData : (allData.connections || []);

    // 1. Filter for connections that have actually reached 'ACTIVATED'
    const activatedConnections = connections.filter(c =>
      c.history && c.history.some(h => h.action === 'ACTIVATED')
    );

    if (activatedConnections.length === 0) return { average: 0, trend: [], validCount: 0 };

    let totalDays = 0;
    let validCount = 0;
    const trendDataMap = new Map();

    activatedConnections.forEach(conn => {
      // 2. Find the exact history nodes
      const createdStep = conn.history.find(h => h.action === 'CREATED');
      const activatedStep = conn.history.find(h => h.action === 'ACTIVATED');

      if (createdStep?.date && activatedStep?.date) {
        const createdDate = new Date(createdStep.date);
        const activatedDate = new Date(activatedStep.date);

        if (!isNaN(createdDate) && !isNaN(activatedDate)) {
          // 3. Calculate difference in days (rounding up to nearest full day)
          const diffTime = Math.abs(activatedDate - createdDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          totalDays += diffDays;
          validCount++;

          // 4. Group by month for the sparkline trend
          const monthYear = activatedDate.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
          if (!trendDataMap.has(monthYear)) {
            trendDataMap.set(monthYear, { month: monthYear, totalDays: 0, count: 0, rawDate: activatedDate });
          }
          const monthData = trendDataMap.get(monthYear);
          monthData.totalDays += diffDays;
          monthData.count++;
        }
      }
    });

    const average = validCount > 0 ? (totalDays / validCount).toFixed(1) : 0;

    // 5. Format and sort trend data for Recharts
    const trend = Array.from(trendDataMap.values())
      .sort((a, b) => a.rawDate - b.rawDate)
      .map(item => ({
        month: item.month,
        avgSLA: Number((item.totalDays / item.count).toFixed(1))
      }));

    return { average, trend, validCount };
  }, [allData, pmData, isProjectManager, summary]);

  // --- AGGREGATE GEOGRAPHICAL DATA (UPDATED FOR ACTIVE CONNECTIONS) ---
  const geoAnalytics = useMemo(() => {
    if (isProjectManager) return [];
    if (!allData || !allData.connections || !allData.customers) return [];

    const activeConnections = allData.connections.filter(c => c.status === 'Active');
    const stateRevenue = {};

    activeConnections.forEach(conn => {
      // Find the associated customer profile to extract their region/state
      const customerId = conn.customer?._id || conn.customer;
      const associatedCustomer = allData.customers.find(c => c._id === customerId);
      const rawState = associatedCustomer?.billingProfile?.[0]?.address?.state;

      if (rawState) {
        const state = rawState.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

        // Calculate total revenue for this connection
        const mrc = Number(conn.commercials?.mrc || 0);
        const ipCost = Number(conn.ips?.cost || 0);
        const revenue = mrc + ipCost;

        stateRevenue[state] = (stateRevenue[state] || 0) + revenue;
      }
    });

    return Object.keys(stateRevenue)
      .map(key => ({
        state: key,
        revenue: stateRevenue[key] // Now using revenue instead of count
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [allData, isProjectManager]);

  // --- AGGREGATE TOP REVENUE ACCOUNTS (WHALES) ---
  const whaleAnalytics = useMemo(() => {
    if (isProjectManager || !allData || !allData.connections) return [];

    const liveConnections = allData.connections.filter(c => c.status === 'Active' || c.status === 'Notice Period');
    const customerTotals = {};

    liveConnections.forEach(conn => {
      const custName = conn.customer?.name || 'Unknown Customer';

      const mrc = Number(conn.commercials?.mrc || 0);
      const ipCost = Number(conn.ips?.cost || 0);
      const circuitRevenue = mrc + ipCost;

      if (!customerTotals[custName]) {
        customerTotals[custName] = { name: custName, totalRevenue: 0, circuitCount: 0 };
      }

      customerTotals[custName].totalRevenue += circuitRevenue;
      customerTotals[custName].circuitCount += 1;
    });

    return Object.values(customerTotals)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);
  }, [allData, isProjectManager]);

  // --- AGGREGATE "AT RISK" WATCHLIST (NOTICE PERIOD) ---
  const atRiskAnalytics = useMemo(() => {
    if (isProjectManager && !pmData) return { connections: [], totalRiskMRR: 0 };
    if (!isProjectManager && (!allData || !allData.connections)) return { connections: [], totalRiskMRR: 0 };

    const connections = isProjectManager ? pmData : (allData.connections || []);
    const noticeConnections = connections.filter(c => c.status === 'Notice Period');

    let totalRiskMRR = 0;

    const mappedConnections = noticeConnections.map(conn => {
      const custName = conn.customer?.name || 'Unknown Customer';
      const mrc = Number(conn.commercials?.mrc || 0);
      const ipCost = Number(conn.ips?.cost || 0);
      const revenue = mrc + ipCost;

      // Sums the risk for ALL connections, not just the top 5
      totalRiskMRR += revenue;

      return {
        id: conn._id,
        customerName: custName,
        circuitId: conn.fabCircuitId || 'N/A',
        revenue: revenue,
        bandwidth: conn.bandwidth || 'N/A', // Swapped provider for bandwidth
        noticeDate: conn.history?.find(h => h.action === 'NOTICE')?.date || conn.updatedAt
      };
    });

    // Sort highest revenue first, then keep only the top 5
    const top5Connections = mappedConnections
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      connections: top5Connections,
      totalRiskMRR
    };
  }, [allData, pmData, isProjectManager]);

  // --- AGGREGATE CHURN VS ACQUISITION TREND ---
  const churnAnalytics = useMemo(() => {
    if (isProjectManager && !pmData) return [];
    if (!isProjectManager && (!allData || !allData.connections)) return [];

    const connections = isProjectManager ? pmData : (allData.connections || []);
    const monthlyData = new Map();

    connections.forEach(conn => {
      if (!conn.history) return;

      conn.history.forEach(event => {
        if (!event.date) return;

        const eventDate = new Date(event.date);
        if (isNaN(eventDate.getTime())) return;

        const monthKey = eventDate.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });

        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, {
            month: monthKey,
            rawDate: new Date(eventDate.getFullYear(), eventDate.getMonth(), 1),
            Activated: 0,
            Churned: 0
          });
        }

        const monthRecord = monthlyData.get(monthKey);

        if (event.action === 'ACTIVATED') {
          monthRecord.Activated += 1;
        } else if (['DISCONNECTED', 'CANCELLED', 'REJECTED', 'DELETED'].includes(event.action)) {
          // Changed to positive addition so it graphs upwards side-by-side
          monthRecord.Churned += 1;
        }
      });
    });

    return Array.from(monthlyData.values())
      .sort((a, b) => a.rawDate - b.rawDate)
      .filter(record => record.Activated !== 0 || record.Churned !== 0);
  }, [allData, pmData, isProjectManager]);

  // 4. ACTION HANDLERS
  const handleMasterExport = async () => {
    if (!summary) {
      toast.error("Data is still loading. Please wait.");
      return;
    }

    setIsExporting(true);
    const tid = toast.loading("Generating Excel Report...");

    try {
      setTimeout(() => {
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

  // 5. EARLY RETURNS (Must happen AFTER all hooks are declared)
  if (loading || pmLoading || !summary) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

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

  // 6. MAIN RENDER
  return (
    <div className="flex-1 min-h-[70vh] p-4 md:p-8 bg-slate-50/50">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <img src="/dristi.webp" alt="" className="h-12 w-12" />
            See Clearly. Act Smartly
          </h1>
          <p className="text-slate-500 mt-2">
            Dristi drives your business forward.
          </p>
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
                  <EyeOff size={14} className="inline mr-1 mb-0.5" />
                  Financial and pricing data have been excluded.
                </span>
              )}
            </p>

            <button
              type="button"
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
                    <IndianRupee size={18} className="text-emerald-400" /> Total Live MRR
                  </div>
                  <span className="text-3xl lg:text-4xl font-black text-emerald-50">{formatCurrency(summary.revenue.totalLiveRevenue)}</span>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-400 font-medium">
                  <Wifi size={18} className="text-blue-400" /> Total Bandwidth
                </div>
                <span className="text-3xl lg:text-4xl font-black text-blue-50">{summary.revenue.totalBandwidth.toLocaleString('en-IN')} <span className="text-lg font-medium text-slate-400">Mbps</span></span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-6 italic">
              * Includes Active and Notice Period connections.
            </p>
          </div>
        </div>

     {isAdmin&&(<>
      {/* CHARTS ROW */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* System Growth Analytics */}
          <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp size={24} className="text-indigo-600" />
                  System Growth Analytics
                </h3>
                <p className="text-sm text-slate-500 mt-1">Track the volume of new revenue over time.</p>
              </div>

              <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                {['day', 'month', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md capitalize transition-colors ${timeRange === range
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                      }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[350px] w-full mt-4">
              {growthAnalytics.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  {/* Changed left margin from -20 to 10 so the currency text fits on the Y-Axis */}
                  <LineChart data={growthAnalytics} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />

                    {/* Y-Axis added width to accommodate currency formatting */}
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} width={60} />

                    <RechartsTooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ stroke: '#cbd5e1', strokeWidth: 2, strokeDasharray: '3 3' }}
                      formatter={(value) => [formatCurrency(value), 'New MRR']}
                    />

                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />

                    {/* The single Revenue line (Customers line has been removed) */}
                    <Line type="monotone" dataKey="Revenue" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <Calendar size={48} className="mb-4 opacity-50" />
                  <p>No timeline data available for the selected range.</p>
                </div>
              )}
            </div>
          </div>

          {/* GEOGRAPHICAL PENETRATION CHART (UPDATED LABELS & FIELDS) */}
          {!isProjectManager && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-[400px]">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <MapPin size={20} className="text-rose-500" />
                  Geographical Penetration
                </h3>
                <p className="text-sm text-slate-500 mt-1">Active MRR distributed by state.</p>
              </div>

              <div className="flex-1 w-full">
                {geoAnalytics.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={geoAnalytics}
                      layout="vertical"
                      // Increased right margin significantly to fit currency strings
                      margin={{ top: 10, right: 90, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />

                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="state"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                        width={120}
                      />

                      <RechartsTooltip
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [formatCurrency(value), 'Live Revenue']}
                      />

                      <Bar dataKey="revenue" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={28}>
                        <LabelList
                          dataKey="revenue"
                          position="right"
                          fill="#64748b"
                          fontSize={13}
                          fontWeight={700}
                          formatter={(val) => formatCurrency(val)} // Format the text outside the bar
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400">
                    <p>No active revenue found for geographic data.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM ROW: Detailed Summaries */}
        <div className={`grid gap-6 ${isProjectManager ? 'grid-cols-1 max-w-md mx-auto w-full' : 'grid-cols-1 md:grid-cols-3'}`}>
          {/* 1. Customer Demographics Card */}
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
                    <span className="flex items-center gap-2 text-slate-600"><Building2 size={14} className="text-slate-400" /> Enterprise</span>
                    <span className="font-bold text-slate-700">{summary.customers.enterprise}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600"><Globe size={14} className="text-slate-400" /> ISP</span>
                    <span className="font-bold text-slate-700">{summary.customers.isp}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600"><Briefcase size={14} className="text-slate-400" /> Operator</span>
                    <span className="font-bold text-slate-700">{summary.customers.operator}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600"><Landmark size={14} className="text-slate-400" /> Government</span>
                    <span className="font-bold text-slate-700">{summary.customers.government}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. Connection Pipeline Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Activity size={18} className="text-indigo-500" /> Inventory State
              </h3>
              <span className="text-xl font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">{summary.connections.total}</span>
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between p-2.5 bg-indigo-50 rounded-lg border border-indigo-100">
                <span className="flex items-center gap-2 text-sm font-medium text-indigo-800"><CheckCircle2 size={16} className="text-indigo-500" /> Live / Active</span>
                <span className="font-bold text-indigo-600">{summary.connections.active}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-lg border border-amber-100">
                <span className="flex items-center gap-2 text-sm font-medium text-amber-800"><Clock size={16} className="text-amber-500" /> In Pipeline (WIP)</span>
                <span className="font-bold text-amber-600">{summary.connections.pending}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-orange-50 rounded-lg border border-orange-100">
                <span className="flex items-center gap-2 text-sm font-medium text-orange-800"><AlertCircle size={16} className="text-orange-500" /> Notice Period</span>
                <span className="font-bold text-orange-600">{summary.connections.notice}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-700"><XCircle size={16} className="text-slate-400" /> Disconnected/Lost</span>
                <span className="font-bold text-slate-600">{summary.connections.churned}</span>
              </div>
            </div>
          </div>

          {/* 3. Top Accounts Leaderboard */}
          {!isProjectManager && (
            <div className="lg:col-span-1 bg-white rounded-2xl p-6 max-h-[60vh] overflow-y-auto shadow-sm border border-slate-200 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Crown size={20} className="text-amber-500" />
                    Top 5 Accounts
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">Largest clients by live MRR.</p>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                {whaleAnalytics.length > 0 ? (
                  whaleAnalytics.map((whale, index) => (
                    <div
                      key={whale.name}
                      className={`flex items-center gap-4 p-3 rounded-xl border transition-all hover:shadow-md ${index === 0
                        ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
                        : 'bg-slate-50 border-slate-100'
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm ${index === 0 ? 'bg-amber-500 text-white' : 'bg-white text-slate-500 border border-slate-200'
                        }`}>
                        {index === 0 ? <Crown size={18} /> : `#${index + 1}`}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 truncate" title={whale.name}>
                          {whale.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <Building size={12} />
                          <span>{whale.circuitCount} Active Circuit{whale.circuitCount !== 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`block font-black ${index === 0 ? 'text-amber-600 text-lg' : 'text-slate-700'}`}>
                          {formatCurrency(whale.totalRevenue)}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">/mo</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 pb-8">
                    <p>No active revenue data found.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* NEW ROW: Churn & Acquisition Trend */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-[400px]">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <ArrowRightLeft size={20} className="text-indigo-600" />
                Activation vs Churn
              </h3>
              <p className="text-sm text-slate-500 mt-1">Monthly comparison of new circuit activations against disconnections.</p>
            </div>

            <div className="flex-1 w-full mt-2">
              {churnAnalytics.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  {/* Removed stackOffset="sign" */}
                  <BarChart data={churnAnalytics} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <RechartsTooltip
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      // Removed Math.abs() since values are now strictly positive
                      formatter={(value, name) => [`${value} Circuits`, name]}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={2} />

                    {/* Removed stackId, updated bar sizes and radiuses to match side-by-side design */}
                    <Bar dataKey="Activated" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="Churned" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <p>No historical activation or churn data available.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* EXECUTIVE LEADERBOARD ROW */}
        {!isProjectManager && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-2">
            <div className="hidden lg:block lg:col-span-3 bg-slate-50/50 rounded-2xl">
              <div className="bg-white rounded-2xl p-0 shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden relative">
                {/* Header Section */}
                <div className={`p-6 border-b ${atRiskAnalytics.connections.length > 0 ? 'bg-rose-50/50 border-rose-100' : 'bg-emerald-50/50 border-emerald-100'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        {atRiskAnalytics.connections.length > 0 ? (
                          <AlertTriangle size={20} className="text-rose-500" />
                        ) : (
                          <ShieldCheck size={20} className="text-emerald-500" />
                        )}
                        "At Risk" Watchlist
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">Circuits currently in Notice Period.</p>
                    </div>

                    {!isProjectManager && atRiskAnalytics.connections.length > 0 && (
                      <div className="text-right bg-white px-4 py-2 rounded-xl shadow-sm border border-rose-100">
                        <span className="block text-xs font-bold text-rose-400 uppercase tracking-wider mb-0.5">Total MRR at Risk</span>
                        <span className="text-lg font-black text-rose-600">{formatCurrency(atRiskAnalytics.totalRiskMRR)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* List Section */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                  {atRiskAnalytics.connections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {atRiskAnalytics.connections.map((conn) => (
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

                            {!isProjectManager && (
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
        )}
     
     </>)}  
      </div>
    </div>
  );
};

export default ReportsDashboard;