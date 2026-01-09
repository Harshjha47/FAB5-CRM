import React, { createContext, useContext, useState } from "react";
import { customerService } from "../Services/customerService";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import emailjs from "@emailjs/browser";

const CustomerApi = createContext();

export const CustomerProvider = ({ children }) => {
  const { UserProfile, profileData } = useAuth();
  const [disconnectionTog, setDisconnectionTog] = useState(false);
  const [filteredData, setFilteredData] = useState(profileData?.customers);
  const [customerInformation, setCustomerImformation] = useState();

  // const sendMail = async (e) => {
  //   const templateParams = {
  //     email: profileData.email,
  //     message: e.message,
  //     subject: e.subject,
  //   };
  //   try {
  //     await emailjs.send(
  //       import.meta.env.VITE_EMAILJS_SERVICE_ID,
  //       "template_6zz7jbm",
  //       templateParams,
  //       import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  //     );
  //     toast.success(`Email sent`);
  //   } catch (err) {
  //     console.log(err);
  //     toast.dismiss();
  //     toast.error("mail not sent");
  //   }
  // };

  const disconnection = async (e) => {
    try {
      toast.loading("loading...");
      const data = await customerService.disconnection(e);
      toast.dismiss();
      UserProfile();
      toast.success("Registered");
    } catch (err) {
      toast.dismiss();
      toast.error("Server error");
    }
  };
  const extension = async (id, e) => {
    try {
      toast.loading("loading...");
      const data = await customerService.extension(id, e);
      toast.dismiss();
      toast.success("Done");
    } catch (err) {
      toast.dismiss();
      toast.error("Server error");
    }
  };
  const redisconnection = async (id, e) => {
    try {
      toast.loading("loading...");
      const data = await customerService.redisconnection(id, e);
      toast.dismiss();
      toast.success("Done");
    } catch (err) {
      toast.dismiss();
      toast.error("Server error");
    }
  };
  const retention = async (id) => {
    try {
      toast.loading("loading...");
      const data = await customerService.retention(id);
      toast.dismiss();
      toast.success("Done");
    } catch (err) {
      toast.dismiss();
      toast.error("Server error");
    }
  };
  const transfer = async (id, e) => {
    try {
      toast.loading("loading...");
      const data = await customerService.transfer(id, e);
      toast.dismiss();
      toast.success("Done");
    } catch (err) {
      toast.dismiss();
      toast.error("Server error");
    }
  };
  const getCustomer = async () => {
    try {
      toast.loading("loading...");
      const data = await customerService.getCustomer();
      toast.dismiss();
    } catch (err) {
      toast.dismiss();
      toast.error("Server error");
    }
  };
  const getCustomerById = async (id) => {
    try {
      const data = await customerService.getCustomerById(id);
      setCustomerImformation(data);
    } catch (err) {
      toast.error("Server error");
    }
  };
  return (
    <CustomerApi.Provider
      value={{
        disconnection,
        extension,
        retention,
        transfer,
        getCustomerById,
        disconnectionTog,
        setDisconnectionTog,
        customerInformation,
        setCustomerImformation,
        redisconnection,
        filteredData,
        setFilteredData,
      }}
    >
      {children}
    </CustomerApi.Provider>
  );
};

export const useCustomer = () => useContext(CustomerApi);
