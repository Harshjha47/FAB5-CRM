import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

let _accessToken = null;
export const setAccessToken = (token) => {
  _accessToken = token;
};
export const getAccessToken = () => _accessToken;

api.interceptors.request.use(
  (config) => {
    if (_accessToken) {
      config.headers.Authorization = `Bearer ${_accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const skipRoutes = [
      "/users/login",
      "/users/refresh",
      "/users/register",
      "/users/register/send-otp",
      "/users/register/verify",
      "/users/request-reset",
      "/users/verify-reset-otp",
      "/users/reset-password",
    ];

    const isSkipRoute = skipRoutes.some(route =>
      originalRequest.url?.includes(route)
    );

    if (error.response?.status === 401 && !originalRequest._retry && !isSkipRoute) {
      originalRequest._retry = true;
      try {
        const { data } = await refreshApi.post("/users/refresh");

        _accessToken = data.accessToken;
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);

      } catch (_error) {
        _accessToken = null;
        if (error.response?.status === 401) {
          window.location.href = "/auth";
        }
        return Promise.reject(_error);
      }
    }
    return Promise.reject(error);
  }
)

export default api;
