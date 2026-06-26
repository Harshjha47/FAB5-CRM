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
    const { data } = await api.post(`/customers/${id}/disconnect`, payload, {
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
    const { data } = await api.put(`/customers/${id}/extend`, payload, {
      withCredentials: true,
    });
    return data;
  },
  retention: async (id) => {
    const { data } = await api.put(`/customers/${id}/retain`, {
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

  editCustomer: async (id, payload) => {
    const { data } = await api.put(`/customers/${id}`, payload, {
      withCredentials: true,
    });
    return data;
  },

  // DELETE CUSTOMER
  deleteCustomer: async (id) => {
    const { data } = await api.delete(`/customers/${id}`, {
      withCredentials: true,
    });
    return data;
  },

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
   addBillingProfile: async (customerId, payload) => {
    const { data } = await api.post(`/customers/${customerId}/billing-profile`, payload, {
      withCredentials: true,
    });
    return data;
  },

  editBillingProfile: async (customerId, profileId, payload) => {
    const { data } = await api.put(`/customers/${customerId}/billing-profile/${profileId}`, payload, {
      withCredentials: true,
    });
    return data;
  },

  removeBillingProfile: async (customerId, profileId) => {
    const { data } = await api.delete(`/customers/${customerId}/billing-profile/${profileId}`, {
      withCredentials: true,
    });
    return data;
  },
};

