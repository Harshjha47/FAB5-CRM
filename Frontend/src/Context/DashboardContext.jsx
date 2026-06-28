import React, {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import dashboardService from "../Services/dashboard.service";
import { useAuth } from "./AuthContext";

const DashboardAPI = createContext();

export const DashboardProvider = ({ children }) => {
  const { user } = useAuth();

  // ────────────────────────────────────────────────────────
  // 1. Core State Framework
  // ────────────────────────────────────────────────────────

  const [metrics, setMetrics] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  const [activeTab, setActiveTab] = useState("connections");

  const [connections, setConnections] = useState([]);
  const [connPage, setConnPage] = useState(1);
  const [connHasMore, setConnHasMore] = useState(true);
  const [loadingConnections, setLoadingConnections] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [custPage, setCustPage] = useState(1);
  const [custHasMore, setCustHasMore] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  const [users, setUsers] = useState([]);
  const [userPage, setUserPage] = useState(1);
  const [userHasMore, setUserHasMore] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [custFilter, setCustFilter] = useState("All");
  const [userFilter, setUserFilter] = useState("All");
  const [connStatusFilter, setConnStatusFilter] = useState("All");

  // ────────────────────────────────────────────────────────
  // 2. Data Action Fetch Handlers
  // ────────────────────────────────────────────────────────

  const fetchMetrics = useCallback(async () => {
    setLoadingMetrics(true);
    try {
      const response = await dashboardService.metrics();
      if (response.success) {
        setMetrics({
          counters: response.counters,
          performance: response.performance
        });
      }
    } catch (err) {
      console.error("Failed to load metrics summaries:", err);
    } finally {
      setLoadingMetrics(false);
    }
  }, []);

  const fetchConnectionsList = useCallback(async (page = 1, status = "All", isScroll = false) => {
    setLoadingConnections(true);
    try {
      const response = await dashboardService.connections({ page, limit: 25, status });
      if (response.success) {
        const fetched = response.connections || [];

        setConnections((prev) => isScroll ? [...prev, ...fetched] : fetched);
        setConnPage(page);
        setConnStatusFilter(status);

        setConnHasMore(page < response.pages);
      }
    } catch (err) {
      // toast.error("Failed to refresh connection grid data");
    } finally {
      setLoadingConnections(false);
    }
  }, []);

  const fetchCustomersList = useCallback(async (page = 1, filter = "All", isScroll = false) => {
    setLoadingCustomers(true);
    try {
      const response = await dashboardService.customers({ page, limit: 25, filter });
      if (response.success) {
        const fetched = response.customers || [];
        setCustomers((prev) => isScroll ? [...prev, ...fetched] : fetched);
        setCustPage(page);
        setCustFilter(filter);
        setCustHasMore(page < response.pages);
      }
    } catch (err) {
      // toast.error("Failed to refresh customer grid data");
    } finally {
      setLoadingCustomers(false);
    }
  }, []);

  const fetchUsersList = useCallback(async (page = 1, filter = "All", isScroll = false) => {
    setLoadingUsers(true);
    try {
      const response = await dashboardService.users({ page, limit: 25, filter });
      if (response.success) {
        const fetched = response.users || [];
        setUsers((prev) => isScroll ? [...prev, ...fetched] : fetched);
        setUserPage(page);
        setUserFilter(filter);
        setUserHasMore(page < response.pages);
      }
    } catch (err) {
      // toast.error("Failed to refresh user management grid");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // ────────────────────────────────────────────────────────
  // 3. Socket Connection Lifecycle
  // ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!user) return;

    const serverUrl = import.meta.env.VITE_API_BASE_URL
      ? new URL(import.meta.env.VITE_API_BASE_URL).origin
      : "http://localhost:5000";

    const socket = io(serverUrl, {
      auth: { token: localStorage.getItem("token") },
      transports: ["websocket", "polling"]
    });

    socket.on("metricsUpdated", (freshMetricsData) => {
      if (freshMetricsData) {
        setMetrics({
          counters: freshMetricsData.counters,
          performance: freshMetricsData.performance
        });
        // toast.success("Dashboard metrics updated in real-time!", { id: "socket-toast" });
      }
    });
    socket.on("connections_mutated", (data) => {
    setConnStatusFilter((currentFilter) => {
      fetchConnectionsList(1, currentFilter, false); //
      return currentFilter;
    });
    
    fetchMetrics(); //
  });

  socket.on("customers_mutated", () => {
    fetchCustomersList(1, false); 
    fetchMetrics(); //
  });

  socket.on("users_mutated", () => {
    fetchUsersList(1, false); 
  });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchMetrics();
      fetchConnectionsList(1, "All", false);
      fetchCustomersList(1, "All", false);
      fetchUsersList(1, "All", false);
    }
  }, [user, fetchMetrics, fetchConnectionsList, fetchCustomersList, fetchUsersList]);

  // ────────────────────────────────────────────────────────
  // 4. Value Memo Layer Construction
  // ────────────────────────────────────────────────────────

  const value = useMemo(
    () => ({
      metrics,
      loadingMetrics,
      fetchMetrics,
      activeTab,
      setActiveTab,
      connections,
      connPage,
      connStatusFilter,
      connHasMore,
      loadingConnections,
      fetchConnectionsList,
      customers,
      custPage,
      custHasMore,
      loadingCustomers,
      fetchCustomersList,
      users,
      userPage,
      userHasMore,
      loadingUsers,
      fetchUsersList, custFilter,
      userFilter,
    }),
    [
      metrics,
      loadingMetrics,
      fetchMetrics,
      activeTab,
      setActiveTab,
      connections,
      connPage,
      connStatusFilter,
      connHasMore,
      loadingConnections,
      fetchConnectionsList,
      customers,
      custPage,
      custHasMore,
      loadingCustomers,
      fetchCustomersList,
      users,
      userPage,
      userHasMore,
      loadingUsers,
      fetchUsersList, custFilter,
      userFilter,
    ]
  );

  return (
    <DashboardAPI.Provider value={value}>{children}</DashboardAPI.Provider>
  );
};

export const useDashboard = () => {
  const context = use(DashboardAPI);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};