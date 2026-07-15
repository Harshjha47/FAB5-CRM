import { useMemo, useState } from 'react';
import api from './api';
import { useAuth } from '../../Context/AuthContext';

// Added `user` to the hook parameters so we can extract the role and name
export const useDashboardAnalytics = ({ allData, pmData, isProjectManager, timeRange, collectionsData }) => {
  const [overview, setOverview] = useState(null);
  const {user}=useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    const totalBandwidth = liveConnections.reduce((acc, curr) => acc + Number(curr.bandwidth || 0), 0);

    return {
      customers: { total: customers.length, active: activeCustomers, inactive: inactiveCustomers, ...typeCounts },
      connections: { total: connections.length, active: activeConns, pending: pendingConns, notice: noticeConns, churned: churnedConns },
      revenue: { totalLiveRevenue, totalBandwidth }
    };
  }, [allData, pmData, isProjectManager]);

  let cancelled = false;
  
  const fetchOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      // Dynamically build the query parameters based on the user's role
      const queryParams = {};
      
      if (user?.role === 'employee') {
        queryParams.isEmployee = true;
        queryParams.employeeName = user.name;
        queryParams.employeeEmail = user.email;
      }

      // Pass the query parameters to the API using Axios's `params` config
      const { data } = await api.get('/reports', { params: queryParams });
      
      console.log('Collections Overview Data:', data);
      if (!cancelled) setOverview(data?.data || null);
    } catch (err) {
      if (!cancelled) setError('Could not load collections data.');
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  // NEW: Streamlined backend-driven growth analytics
  const growthAnalytics = useMemo(() => {
    if (!overview || !overview.collectionsGrowth) {
      return { data: [], salesPersons: [] };
    }

    const rawData = overview.collectionsGrowth.data || [];
    const employees = overview.collectionsGrowth.employees || [];

    // If the UI is set to 'year', group the monthly backend data into yearly totals
    if (timeRange === 'year') {
      const yearMap = new Map();
      
      rawData.forEach(row => {
        // Parse "Jan 24" to "2024"
        const parts = row.time.split(' ');
        const yearLabel = parts.length === 2 ? `20${parts[1]}` : row.time;

        if (!yearMap.has(yearLabel)) {
          const initialData = { time: yearLabel, Global: 0 };
          employees.forEach(emp => { initialData[emp] = 0; });
          yearMap.set(yearLabel, initialData);
        }

        const yearGroup = yearMap.get(yearLabel);
        yearGroup.Global += (row.Global || 0);
        
        employees.forEach(emp => {
          yearGroup[emp] += (row[emp] || 0);
        });
      });

      return {
        data: Array.from(yearMap.values()),
        salesPersons: employees
      };
    }

    // Default: Return the monthly data exactly as the backend provided it
    return {
      data: rawData,
      salesPersons: employees
    };
  }, [overview, timeRange]);

  const geoAnalytics = useMemo(() => {
    if (isProjectManager || !allData?.connections || !allData?.customers) return [];
    const stateRevenue = {};

    allData.connections.filter(c => c.status === 'Active').forEach(conn => {
      const customerId = conn.customer?._id || conn.customer;
      const associatedCustomer = allData.customers.find(c => c._id === customerId);
      const rawState = associatedCustomer?.billingProfile?.[0]?.address?.state;

      if (rawState) {
        const state = rawState.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
        const revenue = Number(conn.commercials?.mrc || 0) + Number(conn.ips?.cost || 0);
        stateRevenue[state] = (stateRevenue[state] || 0) + revenue;
      }
    });

    return Object.keys(stateRevenue).map(key => ({ state: key, revenue: stateRevenue[key] })).sort((a, b) => b.revenue - a.revenue);
  }, [allData, isProjectManager]);

  const whaleAnalytics = useMemo(() => {
    if (isProjectManager || !allData?.connections) return [];
    const customerTotals = {};

    allData.connections.filter(c => c.status === 'Active' || c.status === 'Notice Period').forEach(conn => {
      const custName = conn.customer?.name || 'Unknown Customer';
      const circuitRevenue = Number(conn.commercials?.mrc || 0) + Number(conn.ips?.cost || 0);

      if (!customerTotals[custName]) customerTotals[custName] = { name: custName, totalRevenue: 0, circuitCount: 0 };
      customerTotals[custName].totalRevenue += circuitRevenue;
      customerTotals[custName].circuitCount += 1;
    });

    return Object.values(customerTotals).sort((a, b) => b.totalRevenue - a.totalRevenue).slice(0, 5);
  }, [allData, isProjectManager]);

  const atRiskAnalytics = useMemo(() => {
    const connections = isProjectManager ? pmData : (allData?.connections || []);
    const noticeConnections = connections?.filter(c => c.status === 'Notice Period') || [];
    let totalRiskMRR = 0;

    const mappedConnections = noticeConnections.map(conn => {
      const revenue = Number(conn.commercials?.mrc || 0) + Number(conn.ips?.cost || 0);
      totalRiskMRR += revenue;
      return {
        id: conn._id,
        customerName: conn.customer?.name || 'Unknown Customer',
        circuitId: conn.fabCircuitId || 'N/A',
        revenue,
        bandwidth: conn.bandwidth || 'N/A',
      };
    }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    return { connections: mappedConnections, totalRiskMRR };
  }, [allData, pmData, isProjectManager]);

  const churnAnalytics = useMemo(() => {
    const connections = isProjectManager ? pmData : (allData?.connections || []);
    const monthlyData = new Map();

    const cutoffDate = new Date('2026-04-01T00:00:00Z');

    connections?.forEach(conn => {
      const revenue = Number(conn.commercials?.mrc || 0) + Number(conn.ips?.cost || 0);

      conn.history?.forEach(event => {
        if (!event.date) return;
        const eventDate = new Date(event.date);
        
        if (isNaN(eventDate.getTime()) || eventDate < cutoffDate) return;
        
        const monthKey = eventDate.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }).replace(' ', " '");

        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, { 
            month: monthKey, 
            rawDate: new Date(eventDate.getFullYear(), eventDate.getMonth(), 1), 
            Activated: 0, 
            Churned: 0,
            Revenue: 0,
            ChurnMRR: 0
          });
        }

        if (event.action === 'ACTIVATED') {
          monthlyData.get(monthKey).Activated += 1;
          monthlyData.get(monthKey).Revenue += revenue;
        } else if (['DISCONNECTED', 'CANCELLED', 'REJECTED', 'DELETED'].includes(event.action)) {
          monthlyData.get(monthKey).Churned += 1;
          monthlyData.get(monthKey).ChurnMRR += revenue;
        }
      });
    });

    return Array.from(monthlyData.values())
      .sort((a, b) => a.rawDate - b.rawDate)
      .filter(r => r.Revenue !== 0 || r.ChurnMRR !== 0);
  }, [allData, pmData, isProjectManager]);

  const productAnalytics = useMemo(() => {
    if (isProjectManager || !allData?.connections) return [];
    
    const productTotals = {};
    
    allData.connections.filter(c => c.status === 'Active').forEach(conn => {
      const serviceType = conn.serviceType || 'Unspecified';
      const revenue = Number(conn.commercials?.mrc || 0) + Number(conn.ips?.cost || 0);

      if (!productTotals[serviceType]) {
        productTotals[serviceType] = 0;
      }
      productTotals[serviceType] += revenue;
    });

    const sortedData = Object.entries(productTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    if (sortedData.length > 6) {
      const top5 = sortedData.slice(0, 5);
      const othersValue = sortedData.slice(5).reduce((sum, item) => sum + item.value, 0);
      top5.push({ name: 'Others', value: othersValue });
      return top5;
    }

    return sortedData;
  }, [allData, isProjectManager]);

  return { 
    summary, 
    growthAnalytics,
    cancelled, 
    geoAnalytics, 
    whaleAnalytics, 
    atRiskAnalytics, 
    churnAnalytics, 
    productAnalytics,
    fetchOverview,
    overview, 
    setOverview,
    loading, 
    setLoading,
    error, 
    setError 
  };
};