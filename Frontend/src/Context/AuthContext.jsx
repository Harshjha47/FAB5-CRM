import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import authService from "../Services/authService";
import { setAccessToken } from "../Services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [dashBoardData, setDashBoardData] = useState(null)
  const [loading, setLoading] = useState(true);
  const [resetToken, setResetToken] = useState(null);
  
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { accessToken } = await authService.refresh();
        setAccessToken(accessToken);

        const { user: profile } = await authService.getProfile();
        setUser(profile);
      } catch {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // Register User
  const sendRegistrationOtp = async (email, password) => {
    const toastId = toast.loading("Sending OTP...");
    try {
      await authService.sendOtp({ email, password });
      toast.success(`OTP sent to ${email}`, { id: toastId });
      return true;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to send OTP";
      toast.error(message, { id: toastId });
      return false;
    }
  };
  const verifyOtpAndRegister = async (email, password, otp, name = null) => {
    const toastId = toast.loading("Creating account...");
    try {
      const data = await authService.verifyOtp({
        email,
        password,
        otp,
        ...(name && { name }),
      });

      setAccessToken(data.accessToken);
      setUser(data.user);
      toast.success("Account created successfully!", { id: toastId });
      return data.redirect || "/profile";
    } catch (err) {
      const message = err.response?.data?.message || "Verification failed";
      toast.error(message, { id: toastId });
      return false;
    }
  };

  // Login User
  const login = async (email, password) => {
    const toastId = toast.loading("Logging in...");
    try {
      const data = await authService.login({ email, password });
      setAccessToken(data.accessToken);
      setUser(data.user);
      toast.success("Welcome back!", { id: toastId });
      return data.redirect || "/dashboard";
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      toast.error(message, { id: toastId });
      return false;
    }
  };

  // Logout User
  const logout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      await authService.logout();
    } catch {
      // Even if API fails, clear local state
    } finally {
      setAccessToken(null);
      setUser(null);
      setDashBoardData(null);
      toast.success("Logged out", { id: toastId });
      return true;
    }
  };

  // Reset password
  const requestReset = async (email) => {
    const toastId = toast.loading("Sending OTP...");
    try {
      await authService.requestReset({ email });
      toast.success("If this email exists, an OTP has been sent", { id: toastId });
      return true;
    } catch (err) {
      toast.error("Something went wrong. Please try again.", { id: toastId });
      return false;
    }
  };
  const verifyResetOtp = async (email, otp) => {
    const toastId = toast.loading("Verifying OTP...");
    try {
      const data = await authService.verifyResetOtp({ email, otp });
      setResetToken(data.resetToken); // store in state — NOT localStorage
      toast.success("OTP verified!", { id: toastId });
      return true;
    } catch (err) {
      const message = err.response?.data?.message || "Invalid or expired OTP";
      toast.error(message, { id: toastId });
      return false;
    }
  };
  const resetPassword = async (password) => {
    const toastId = toast.loading("Resetting password...");
    try {
      await authService.resetPassword({ resetToken, password });
      setResetToken(null);
      toast.success("Password reset successfully! Please log in.", { id: toastId });
      return true;
    } catch (err) {
      const message = err.response?.data?.message || "Reset failed";
      toast.error(message, { id: toastId });
      return false;
    }
  };

  // Profile
  const updateProfile = async (profileData) => {
    const toastId = toast.loading("Saving profile...");
    try {
      const data = await authService.updateProfile(profileData);
      setUser(data.user);
      toast.success("Profile saved!", { id: toastId });
      return data.redirect || "/dashboard";
    } catch (err) {
      const message = err.response?.data?.message || "Failed to save profile";
      toast.error(message, { id: toastId });
      return false;
    }
  };

  const getDashboardData = async (page = 1, limit = 25) => {
    try {
      const data = await authService.getAllUsers(page, limit);
      setDashboardData(data);
      return data;
    } catch (err) {
      toast.error("Failed to load dashboard data");
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        dashBoardData,
        resetToken,
        login,
        logout,
        sendRegistrationOtp,
        verifyOtpAndRegister,
        requestReset,
        verifyResetOtp,
        resetPassword,
        updateProfile,
        getDashboardData,
        isLoggedIn: !!user,
        isProfileComplete: !!user?.isProfileComplete ?? false,
        userRole: user?.role ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);