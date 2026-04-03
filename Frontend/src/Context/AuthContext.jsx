import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import authService from "../Services/authService";
import { handleRequest } from "../Services/handleRequest";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("Customers");
  const [allData, setAllData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resetToken, setResetToken] = useState(null);
  const [activeTab, setActiveTab] = useState("connections");
  const [statusFilter, setStatusFilter] = useState("all");
  const [status, setStatus]=useState()
  const [registerData,setRegisterData]=useState()

  const isAuthenticated = useMemo(() => !!user, [user]);

  const getDashboardData = useCallback(async () => {
    try {
      
      const data = await authService.getAllUsers();
      setAllData(data);
      return data;
    } catch (err) {
      toast.error("Failed to load dashboard data");
      return null;
    }finally{

    }
  }, []);




  const UserProfile = async () => {
    try {
      const { user: profile } = await authService.getProfile();
      setUser(profile);
      getDashboardData();
    } catch (err) {
    } finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    UserProfile();
  }, []);

  const sendRegistrationOtp = useCallback(async (email, password) => {
    return await handleRequest(
      () => authService.sendOtp({ email, password }),
      `OTP sent to ${email}`,
    );
  }, []);

  const verifyOtpAndRegister = useCallback(
    async (email, password, otp, name = null) => {
      const successCallback = (data) => {
        // setAccessToken(data.accessToken);
        setUser(data.user);
      };

      const res = await handleRequest(
        () =>
          authService.verifyOtp({
            email,
            password,
            otp,
            ...(name && { name }),
          }),
        "Account created successfully!",
        successCallback,
      );

      return res ? res.redirect || "/profile" : false;
    },
    [],
  );

  const login = useCallback(
    async (email, password) => {
      const successCallback = (data) => {
        setUser(data.user);
        getDashboardData(); // Add this to load data immediately after login
      };

      const res = await handleRequest(
        () => authService.login({ email, password }),
        "Welcome back!",
        successCallback,
      );

      return res ? res.redirect || "/dashboard" : false;
    },
    [getDashboardData],
  );

  const logout = useCallback(async () => {
    const tid = toast.loading("Logging out...");
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setUser(null);
      setAllData(null);
      toast.success("Logged out", { id: tid });
    }
  }, []);

  const requestReset = useCallback(async (email) => {
    return await handleRequest(
      () => authService.requestreset( email ),
      "If this email exists, an OTP has been sent",
      ()=>setStatus(1)
    );
  }, []);

  const verifyResetOtp = useCallback(async (e) => {
    const successCallback = (data) => {
      setResetToken(data.resetToken);
      setStatus(4)
    };

    const res = await handleRequest(
      () => authService.verifyResetOtp(e),
      "OTP verified!",
      successCallback,

    );

    return !!res; // Returns true if success, false if failed
  }, []);

  const resetPassword = useCallback(
    async (password) => {
      const successCallback = () => {
        setResetToken(null);
      };

      const res = await handleRequest(
        () => authService.resetpassword({ resetToken, password }),
        "Password reset successfully! Please log in.",
        successCallback,
      );

      return !!res;
    },
    [resetToken],
  );

  const updateProfile = useCallback(async (profileData) => {
    const successCallback = (data) => {
      setUser(data.user);
    };

    const res = await handleRequest(
      () => authService.updateProfile(profileData),
      "Profile saved!",
      successCallback,
    );

    return res ? res.redirect || "/dashboard" : false;
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      loading,
      allData,
      setAllData,
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
      tab,
      setTab,
      activeTab,
      setActiveTab,
      statusFilter,
      setStatusFilter,
      UserProfile,status, setStatus,registerData,setRegisterData,
      isLoggedIn: !!user,
      isProfileComplete: !!user?.isProfileComplete,
      userRole: user?.role ?? null,
    }),
    [
      user,
      loading,
      allData,
      setAllData,
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
      UserProfile,
      tab,
      setTab,
      activeTab,
      setActiveTab,
      statusFilter,
      setStatusFilter,
      status, setStatus,registerData,setRegisterData,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
