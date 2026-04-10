import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { customerService } from "../Services/customerService";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { handleRequest } from "../Services/handleRequest";

const CustomerApi = createContext();

export const CustomerProvider = ({ children }) => {
  const { getDashboardData, profileData} = useAuth();
  const [disconnectionTog, setDisconnectionTog] = useState(false);
  const [customerInformation, setCustomerImformation] = useState();
  const [customerlist, setCustomerList] = useState();
  const [filteredData, setFilteredData] =
    useState();
    // customerlist || profileData?.customers,
  const newCustomeInit = {
    name: "",
    person: "",
    email: "",
    mobile: "",
    customerType:"",
    billingProfiles: {
      label: "",
      gstNumber: "",
      address: {
        street: "",
        city: "",
        state: "",
        pincode: "",
      },
    },
    companyDocs: [{ file: null, documentType: "Company PAN" }],
    signatoryDocs: [{ file: null, documentType: "PAN" }]
  };
  const [newCustommer, setNewCustomer] = useState(newCustomeInit);

  // const createCustomer = useCallback(
  //   async (e) => {
  //     const tid = toast.loading("loading...");
  //     try {
  //       await customerService.createCustomer(e);
  //       toast.success("Registered", { id: tid });
  //       await getDashboardData();
  //     } catch (err) {
  //       toast.error("Server error", { id: tid });
  //     }
  //   },
  //   [getDashboardData],
  // );

      const createCustomer = useCallback(async (e) => {
      return await handleRequest(
        () => customerService.createCustomer(e),
        "Registered",
        () => getDashboardData()
      );
    }, [getDashboardData]);

  //   const disconnection = useCallback(async (id, e) => {
  //   const tid = toast.loading("loading...");
  //   try {
  //     await customerService.disconnection(id, e);
  //     toast.success("Done", { id: tid });
  //     getDashboardData();
  //   } catch (err) {
  //     toast.error("Server error", { id: tid });
  //   }
  // }, []);

    const disconnection = useCallback(async (id, e) => {
      return await handleRequest(
        () => customerService.disconnection(id, e),
        "Disconnection Raised",
        () => getDashboardData()
      );
    }, [getDashboardData]);

  const extension = useCallback(async (id, e) => {
    const tid = toast.loading("loading...");
    try {
      await customerService.extension(id, e);
      toast.success("Done", { id: tid });
        getDashboardData()

    } catch (err) {
      toast.error("Server error", { id: tid });
    }
  }, []);

  const retention = useCallback(async (id) => {
    const tid = toast.loading("loading...");
    try {
      await customerService.retention(id);
      toast.success("Done", { id: tid });
        getDashboardData()

    } catch (err) {
      toast.error("Server error", { id: tid });
    }
  }, []);

  const redisconnection = async (id, e) => {
    try {
      toast.loading("loading...");
      const data = await customerService.redisconnection(id, e);
      toast.dismiss();
      toast.success("Done")
      getDashboardData()

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
      toast.success("Done")
       getDashboardData()

    } catch (err) {
      toast.dismiss();
      toast.error("Server error");
    }
  };
  const getCustomer = async () => {
    try {
      toast.loading("loading...");
      const data = await customerService.getCustomer();
      toast.dismiss()
      getDashboardData()

    } catch (err) {
      toast.dismiss();
      toast.error("Server error");
    }
  };

  const getCustomerById = useCallback(async (id) => {
    try {
      const data = await customerService.getCustomerById(id);
      setCustomerImformation(data?.customer)
       getDashboardData()

    } catch (err) {
      toast.error("Server error");
    }
  }, []);

  // const getAllCustomer = useCallback(async () => {
  //   try {
  //     if (profileData?.role === "admin") {
  //       const data = await customerService.getAllCustomers();
  //       setCustomerList(data || []);
  //       // getDashboardData()

  //     }
  //   } catch (err) {
  //     console.error("Fetch customers error:", err);
  //   }
  // }, [profileData?.role]);
  const getAllCustomer = useCallback(async () => {
  try {
    if (profileData?.role === "admin") {
      const data = await customerService.getAllCustomers();
      setCustomerList(data || []);
      // REMOVED getDashboardData() to break the infinite loop
    }
  } catch (err) {
    console.error("Fetch customers error:", err);
  }
}, [profileData?.role]);


  

  useEffect(() => {
    if (profileData?.role === "admin") {
      getAllCustomer();
    }
  }, [profileData?.role, getAllCustomer]);

  const value = useMemo(
    () => ({
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
      createCustomer,
      newCustommer,
      setNewCustomer,
      newCustomeInit,
    }),
    [
      extension,
      getCustomerById,
      disconnectionTog,
      customerInformation,
      filteredData,
      customerlist,
      getAllCustomer,
      createCustomer,
      newCustommer,
      newCustomeInit,
    ],
  );
  return <CustomerApi.Provider value={value}>{children}</CustomerApi.Provider>;
};

export const useCustomer = () => useContext(CustomerApi);
