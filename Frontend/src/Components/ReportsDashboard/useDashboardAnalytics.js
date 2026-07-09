import { useMemo } from 'react';

export const useDashboardAnalytics = ({ allData, pmData, isProjectManager, timeRange }) => {
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

  const growthAnalytics = useMemo(() => {
    if (!summary) return { data: [], salesPersons: [] }; 
    const connections = isProjectManager ? pmData : (allData.connections || []);
    
    const dataMap = new Map();
    const uniqueSalesPersons = new Set(); 

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
          dataMap.set(key, { time: key, Global: 0, rawDate: new Date(conn.createdAt) });
        }
        
        const revenue = Number(conn.commercials?.mrc || 0) + Number(conn.ips?.cost || 0);
        const monthData = dataMap.get(key);
        
        monthData.Global += revenue;

        // FIX: Extract Account Manager/Salesperson correctly based on actual JSON data structure
        let spName = 'Unknown';
        if (conn.customer?.managedBy?.name) {
          spName = conn.customer.managedBy.name; // Uses "Harsh" or other account managers
        } else if (conn.createdBy?.name) {
          spName = conn.createdBy.name; // Fallback to connection creator
        } else if (conn.salesPerson) {
          // Legacy fallback just in case
          spName = typeof conn.salesPerson === 'string' ? conn.salesPerson : (conn.salesPerson.name || 'Unknown');
        }
        
        uniqueSalesPersons.add(spName);

        if (!monthData[spName]) {
          monthData[spName] = 0;
        }
        monthData[spName] += revenue;
      }
    });

    const chartData = Array.from(dataMap.values()).sort((a, b) => a.rawDate - b.rawDate);

    chartData.forEach(row => {
      uniqueSalesPersons.forEach(sp => {
        if (row[sp] === undefined) row[sp] = 0;
      });
    });

    return {
      data: chartData,
      salesPersons: Array.from(uniqueSalesPersons)
    };
  }, [allData, pmData, isProjectManager, summary, timeRange]);

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

    connections?.forEach(conn => {
      conn.history?.forEach(event => {
        if (!event.date) return;
        const eventDate = new Date(event.date);
        if (isNaN(eventDate.getTime())) return;
        
        const monthKey = eventDate.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, { month: monthKey, rawDate: new Date(eventDate.getFullYear(), eventDate.getMonth(), 1), Activated: 0, Churned: 0 });
        }

        if (event.action === 'ACTIVATED') monthlyData.get(monthKey).Activated += 1;
        else if (['DISCONNECTED', 'CANCELLED', 'REJECTED', 'DELETED'].includes(event.action)) monthlyData.get(monthKey).Churned += 1;
      });
    });

    return Array.from(monthlyData.values()).sort((a, b) => a.rawDate - b.rawDate).filter(r => r.Activated !== 0 || r.Churned !== 0);
  }, [allData, pmData, isProjectManager]);

  return { summary, growthAnalytics, geoAnalytics, whaleAnalytics, atRiskAnalytics, churnAnalytics };
};