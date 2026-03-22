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
import { useAuth } from "./AuthContext";
import { handleRequest } from "../Services/handleRequest";

const ConnectionAPI = createContext();

export const ConnectionProvider = ({ children }) => {
  const [connectionData, setConnectionData] = useState([]);
  const [singleConnectionData, setSingleConnectionData] = useState();
  const { setFilteredData } = useCustomer();
  const {getDashboardData}=useAuth()


  // --- GETTERS ---

    const getConnection = async (id, e) => {
    try {
      const { connections } = await ConnectionService.getConnection(id);
      setConnectionData(connections);
    } catch (err) {
      toast.error("Server error");
    }
  };

  const getConnectionById = useCallback(async (id) => {
    return await handleRequest(
      () => ConnectionService.getConnectionById(id),
      "Connection loaded",
      (data) => setSingleConnectionData(data.connection)
    );
  }, []);


  // --- ACTIONS (MUTATIONS) ---

  const createConnection = useCallback(async (id, e) => {
    return await handleRequest(
      () => ConnectionService.createConnection(id, e),
      "Registered Successfully",
      () => getDashboardData()
    );
  }, [getDashboardData]);

  const putConnection = useCallback(async (id, e) => {
    return await handleRequest(
      () => ConnectionService.putConnection(id, e),
      "Update Successful"
    );
  }, []);

  const patchConnection = useCallback(async (id, e) => {
    return await handleRequest(
      () => ConnectionService.patchConnection(id, e),
      "Update Successful"
    );
  }, []);

  const approveConnection = useCallback(async (id) => {
    return await handleRequest(
      () => ConnectionService.approveConnection(id),
      "Update Successful",
      
    );
  }, []);

  const activeConnection = useCallback(async (id, e) => {
    return await handleRequest(
      () => ConnectionService.activeConnection(id, e),
      "Update Successful",
      
    );
  }, []);

    const Reject = useCallback(async (id, e) => {
    return await handleRequest(
      () => ConnectionService.reject(id, e),
      "Reject Successful",
      
    );
  }, []);

  const Generate = useCallback(async (id) => {
    return await handleRequest(
      () => ConnectionService.generate(id),
      "Generate Successful",
      
    );
  }, []);

  const addIp = useCallback(async (id, e) => {
    return await handleRequest(
      () => ConnectionService.addIp(id, e),
      "Update Successful",
      
    );
  }, []);




  const value = useMemo(
    () => ({
      createConnection,
      getConnection,
      connectionData,
      setConnectionData,
      Generate,
      putConnection,
      patchConnection,
      getConnectionById,
      singleConnectionData,
      setSingleConnectionData,
      approveConnection,
      activeConnection,
      Reject,
      addIp,
    }),
    [
      createConnection,
      getConnection,
      connectionData,
      Generate,
      putConnection,
      patchConnection,
      getConnectionById,
      singleConnectionData,
      approveConnection,
      activeConnection,
      addIp,
      Reject,
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
