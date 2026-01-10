import React, { createContext, useContext, useEffect, useState } from "react";
import { customerService } from "../Services/customerService";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const CustomerApi = createContext();

export const CustomerProvider = ({ children }) => {
  const { UserProfile, profileData } = useAuth();
  const [disconnectionTog, setDisconnectionTog] = useState(false);
  const [customerInformation, setCustomerImformation] = useState();
  const [customerlist, setCustomerList] = useState();
  const [filteredData, setFilteredData] = useState(customerlist || profileData?.customers);
  


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
  const getAllCustomer = async () => {
    try {
      if (profileData.role == "admin") {
        const data = await customerService.getAllCustomers();
        setCustomerList(data);
      }
    } catch (err) {
    }
  };
  useEffect(() => {
    getAllCustomer();
  }, []);
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
        customerlist,
        setCustomerList,
        getAllCustomer,
      }}
    >
      {children}
    </CustomerApi.Provider>
  );
};

export const useCustomer = () => useContext(CustomerApi);
