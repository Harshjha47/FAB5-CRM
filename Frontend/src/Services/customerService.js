import api from "./api";

export const customerService = {
  // create

  createCustomer: async (payload) => {
    const { data } = await api.post(`/customers/create`, payload, {
      withCredentials: true,
    });
    return data;
  },

  disconnection: async (id,payload) => {
    const { data } = await api.post(`/customers/${id}`, payload, {
      withCredentials: true,
    });
    return data;
  },

  // edit
  redisconnection: async (id, payload) => {
    const { data } = await api.put(
      `/customers/redisconnection/${id}`,
      payload,
      {
        withCredentials: true,
      },
    );
    return data;
  },
  extension: async (id, payload) => {
    const { data } = await api.put(`/customers/extension/${id}`, payload, {
      withCredentials: true,
    });
    return data;
  },
  retention: async (id) => {
    const { data } = await api.put(`/customers/retention/${id}`, {
      withCredentials: true,
    });
    return data;
  },
  transfer: async (id, payload) => {
    const { data } = await api.put(`/customers/transfer/${id}`, payload, {
      withCredentials: true,
    });
    return data;
  },

  // read

  getCustomer: async () => {
    const { data } = await api.get(`/customers/emp`, {
      withCredentials: true,
    });
    return data;
  },
  getCustomerById: async (id) => {
    const { data } = await api.get(`/customers/${id}`, {
      withCredentials: true,
    });
    return data;
  },
  getAllCustomers: async (id) => {
    const { data } = await api.get(`/customers`, {
      withCredentials: true,
    });
    return data;
  },
};

