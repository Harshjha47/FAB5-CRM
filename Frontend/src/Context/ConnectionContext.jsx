import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import { ConnectionService } from "../Services/connectionService";
import { useCustomer } from "./CustomerContext";

const ConnectionAPI = createContext();

export const ConnectionProvider = ({ children }) => {
  const [connectionData, setConnectionData] = useState([]);
  const [singleConnectionData, setSingleConnectionData] = useState();
  const { setFilteredData } = useCustomer();

  const getProjectConnection = useCallback(async () => {
    try {
      const { data } = await ConnectionService.getProjectConnection();
      setConnectionData(data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load connections");
    }
  }, []);
  

  const createConnection = async (id, e) => {
    try {
      toast.loading("loading...");
      const data = await ConnectionService.createConnection(id, e);
      toast.dismiss();
      toast.success("Registered");
    } catch (err) {
      toast.dismiss();
      toast.error("Server error");
    }
  };
  const putConnection = async (id, e) => {
    try {
      toast.loading("loading...");
      const data = await ConnectionService.putConnection(id, e);
      toast.dismiss();
      toast.success("Update Successful");
    } catch (err) {
      toast.dismiss();
      toast.error("Server error");
    }
  };
  const patchConnection = async (id, e) => {
    try {
      toast.loading("loading...");
      const data = await ConnectionService.patchConnection(id, e);
      toast.dismiss();
      toast.success("Update Successful");
    } catch (err) {
      toast.dismiss();
      toast.error("Server error");
    }
  };

  const approveConnection = async (id) => {
    try {
      toast.loading("loading...");
      const data = await ConnectionService.approveConnection(id);
      toast.dismiss();
      toast.success("Update Successful");
      getProjectConnection();
    } catch (err) {
      toast.dismiss();
      toast.error("Server error");
    }
  };

    const activeConnection = async (id,e) => {
    try {
      toast.loading("loading...");
      const data = await ConnectionService.activeConnection(id,e);
      toast.dismiss();
      toast.success("Update Successful");
      getProjectConnection();
    } catch (err) {
      toast.dismiss();
      toast.error("Server error");
    }
  };

  const auditConnection = async (id,e) => {
    try {
      toast.loading("loading...");
      const data = await ConnectionService.auditConnection(id);
      toast.dismiss();
      toast.success("Update Successful");
      getProjectConnection();
    } catch (err) {
      toast.dismiss();
      toast.error("Server error");
    }
  };
    const addIp = async (id,e) => {
    try {
      toast.loading("loading...");
      const data = await ConnectionService.addIp(id,e);
      toast.dismiss();
      toast.success("Update Successful");
      getProjectConnection();
    } catch (err) {
      toast.dismiss();
      toast.error("Server error");
    }
  };
  const getConnection = async (id, e) => {
    try {
      const { connections } = await ConnectionService.getConnection(id);
      setConnectionData(connections);
    } catch (err) {
      toast.error("Server error");
    }
  };

  const getConnectionById = async (id) => {
    try {
      toast.loading("loading...");
      const { data } = await ConnectionService.getConnectionById(id);
      setSingleConnectionData(data);
      toast.dismiss();
    } catch (err) {
      toast.dismiss();
      toast.error("Server error");
    }
  };

  const value = useMemo(
    () => ({
      createConnection,
      getConnection,
      connectionData,
      setConnectionData,
      getProjectConnection,
      auditConnection,
      putConnection,
      patchConnection,
      getConnectionById,
      singleConnectionData,
      setSingleConnectionData,
      approveConnection,
      activeConnection,
      addIp,
    }),
    [
      createConnection,
      getConnection,
      connectionData,
      getProjectConnection,
      auditConnection,
      putConnection,
      patchConnection,
      getConnectionById,
      singleConnectionData,
      approveConnection,
      activeConnection,
      addIp,
    ]
  );

  return (
    <ConnectionAPI.Provider value={value}>{children}</ConnectionAPI.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionAPI);
  if (!context) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
};
