import api from "./api";

export const ConnectionService = {
  createConnection: async (id,payload) => {
    const { data } = await api.post(`/connection/${id}`, payload, {
      withCredentials: true,
    });
    return data;
  },
  getConnection: async (id) => {
    const { data } = await api.get(`/connection/${id}`, {
      withCredentials: true,
    });
    return data;
  },

  getProjectConnection: async (id) => {
    const { data } = await api.get(`/connection/project`, {
      withCredentials: true,
    });
    return data;
  },

  approveConnection: async (id) => {
    const { data } = await api.patch(`/connection/approve/${id}`, {
      withCredentials: true,
    });
    return data;
  },
  activeConnection: async (id,e) => {
    const { data } = await api.put(`/connection/active/${id}`,e, {
      withCredentials: true,
    });
    return data;
  },
   addIp: async (id,e) => {
    const { data } = await api.put(`/connection/add/${id}`,e, {
      withCredentials: true,
    });
    return data;
  },
  auditConnection: async (id) => {
    const { data } = await api.put(`/connection/audit/${id}`, {
      withCredentials: true,
    });
    return data;
  },

  getConnectionById: async (id) => {
    const {data}  = await api.get(`/connection/details/${id}`, {
      withCredentials: true,
    });
    
    return data;
  },

  putConnection: async (id,payload) => {
    const { data } = await api.put(`/connection/${id}`,payload ,{
      withCredentials: true,
    });
    return data;
  },
  
  patchConnection: async (id,payload) => {
    const { data } = await api.patch(`/connection/${id}`,payload ,{
      withCredentials: true,
    });
    return data;
  },
};