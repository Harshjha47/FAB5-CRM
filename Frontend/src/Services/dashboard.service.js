// src/services/dashboard.service.js
import api from "./api";

const dashboardService = {
  metrics: async () => {
    const { data } = await api.get("/dashboard/metrics");
    return data;
  },
  
  connections: async ({ page = 1, limit = 25, status = "All" }) => {
    const { data } = await api.get("/dashboard/connections", {
      params: { page, limit, status }
    });
    return data;
  },
  customers: async ({ page = 1, limit = 25, filter }) => {
    const { data } = await api.get("/dashboard/customers", {
      params: { page, limit,filter }
    });
    return data;
  },
  users: async ({ page = 1, limit = 25 ,filter}) => {
    const { data } = await api.get("/dashboard/users", {
      params: { page, limit ,filter}
    });
    return data;
  },
  search: async (searchQuery) => {
  const { data } = await api.get("/dashboard/search", {
    params: { q: searchQuery }
  });
  return data;
}
};

export default dashboardService;