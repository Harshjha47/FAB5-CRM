import React, { createContext, useContext, useEffect, useState } from "react";
import authService from "../Services/authService";
import { handleRequest } from "../Services/handleRequest";
import toast from "react-hot-toast";

const AuthApi = createContext();

export const AuthProvider = ({ children }) => {
  const [registerData, setRegisterData] = useState();
  const [profileData, setProfileData] = useState();
  const [allProfileData, setAllProfileData] = useState();
  const [allData, setAllData] = useState();
  const [otpData, setOtpData] = useState();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState();
  const [tab, setTab] = useState("Customers");

  const genrateOtp = () => {
    return Math.floor(Math.random() * 8999) + 1000;
  };
  const resendCode = (e) => {
    sendOTP(e, otpData);
  };

  const sendOTP = async (e, i) => {
    const templateParams = {
      email: e,
      otp: i,
    };
    try {
      toast.loading("loading...");
      await authService.sendotp(templateParams)
      toast.dismiss();
      toast.success(`Otp has sent to ${e}`);
    } catch (err) {
      toast.dismiss();
      toast.error("Server error");
    }
  };

const LoginUser = async (e) => {
  await handleRequest(
    () => authService.login(e),
    "Welcome back!",
    (response) => {
      setProfileData(response);
      window.location.replace("/dashboard");
    }
  );
};

const RegisterUser = async (e) => {
  await handleRequest(
    () => authService.register(e),
    "Account created successfully",
    (data) => setProfileData(data)
  );
};

  const LogoutUser = async () => {
  await handleRequest(
    () => authService.logout(),
    "Logged out",
    () => {
      setProfileData(null);
      window.location.replace("/auth");
    }
  );
};


  const requestReset = async (inputBox) => {
    try {
      toast.loading("loading...");
      const { data } = await authService.requestreset(inputBox);
      toast.dismiss();
      setRegisterData(inputBox.email);
      let genOtp = genrateOtp();
      await sendOTP(inputBox.email, genOtp);
      setOtpData(genOtp);
      setStatus(1);
    } catch (err) {
      toast.dismiss();
      toast.error("Server error");
    }
  };

  const resetPassword = async (inputBox) => {
    try {
      toast.loading("loading...");
      const responce = await authService.resetpassword(inputBox);
      toast.dismiss();
      toast.success("Password reset successfully");
    } catch (err) {
      toast.dismiss();
      toast.error("Server error");
    }
  };

  // profile

  useEffect(() => {
    UserProfile();
  }, []);

  const UserProfile = async () => {
    try {
      const { user } = await authService.getProfile();
      setProfileData(user);
    } catch (err) {
      setProfileData(null);
    } finally {
      setLoading(false);
      // toast.dismiss();
      
    }
  };
    const getAllUser = async () => {
    try {
      const  data  = await authService.getAllUsers();
      const {users}=data
      setAllData(data)
      setAllProfileData(users);
    } catch (err) {
      setAllProfileData(null);
    } finally {
      setLoading(false);
    }
  };
  
  const EditProfile = async (e) => {
    try {
      toast.loading("loading...");
      const { user } = await authService.editProfile(e);
      toast.dismiss();
      toast.success("Profile saved");
      setProfileData(user);
    } catch (err) {
      toast.dismiss();
      toast.error("Server error");
    } finally {
    }
  };

  return (
    <AuthApi.Provider
      value={{
        requestReset,
        status,
        setStatus,
        otpData,
        resetPassword,
        resendCode,
        setOtpData,
        LoginUser,
        profileData,
        setProfileData,
        RegisterUser,
        sendOTP,
        registerData,
        setRegisterData,
        genrateOtp,
        EditProfile,
        LogoutUser,
        UserProfile,
        loading,
        getAllUser,allProfileData, setAllProfileData,allData, setAllData,tab, setTab
      }}
    >
      {children}
    </AuthApi.Provider>
  );
};

export const useAuth = () => useContext(AuthApi);
