import api from "./api";

const authService = {
  register: async (payload) => {
    const { data } = await api.post("/users/register", payload, {
      withCredentials: true,
    });
    localStorage.setItem("token", data?.token);
    return data?.user;
  },

  login: async (credentials) => {
    const { data } = await api.post("/users/login", credentials);
    localStorage.setItem("token", data?.token);
    return data?.user;
  },

  sendotp: async (e) => {
    const { data } = await api.post("/users/otp", e);
    return data;
  },

  requestreset: async (credentials) => {
    const responce = await api.post("/users/request-reset", credentials, {
      withCredentials: true,
    });
    return responce;
  },
  resetpassword: async (credentials) => {
    const responce = await api.patch("/users/reset-password", credentials, {
      withCredentials: true,
    });
    return responce;
  },

  //profile

  logout: async () => {
    try {
      await api.post("/users/logout");
    } catch (err) {
    } finally {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  },

  getProfile: async () => {
    const { data } = await api.get("/users/me");
    return data;
  },

  editProfile: async (info) => {
    const { data } = await api.put("/users/me", info);
    return data;
  },

  //admin

  //users
  deleteUser: async (productId) => {
    const { data } = await api.delete(`all/${productId}`);
    return data;
  },
  getAllUsers: async () => {
    const  {data}  = await api.get(`users/all`);
    return data;
  },
};

export default authService;
