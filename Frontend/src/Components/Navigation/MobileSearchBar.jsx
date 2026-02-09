import React, { useEffect, useState, useMemo } from "react";
import { CiSearch } from "react-icons/ci";
import { useAuth } from "../../Context/AuthContext";
import { useCustomer } from "../../Context/CustomerContext";
import { useLocation } from "react-router-dom";
import { useConnection } from "../../Context/ConnectionContext";

function MobileSearchBar() {
  const { profileData, getAllUser, allProfileData } = useAuth();
  const { connectionData, getProjectConnection } = useConnection();
  const { customerlist, setFilteredData, getAllCustomer } = useCustomer();
  const location = useLocation();
  

  const [search, setSearch] = useState("");

  // 1. Initial Data Fetching based on Role
  useEffect(() => {
    if (profileData?.role == "admin") {
      getAllUser();
    }
    if (["project", "owner"].includes(profileData?.role)) {
      getProjectConnection();
    } else {
      getAllCustomer();
    }
  }, [profileData?.role]); // Re-fetch only if role changes

  // 2. Stabilize the Data Source
  // This prevents the infinite loop by only updating when actual data changes
  const dataSource = useMemo(() => {
    if (profileData?.role === "admin") {
      return location.pathname.includes("team") ? allProfileData : customerlist;
    }
    if (["project", "owner"].includes(profileData?.role)) {
      return connectionData;
    }
    return profileData?.customers || [];
  }, [
    profileData,
    location.pathname,
    allProfileData,
    customerlist,
    connectionData,
  ]);

  // 3. Optimized Search Logic (Debounced to save mobile CPU)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!search.trim()) {
        setFilteredData(dataSource);
        return;
      }

      const lowerSearch = search.toLowerCase();
      const results = dataSource?.filter((item) => {
        return (
          item?.name?.toLowerCase().includes(lowerSearch) ||
          item?.email?.toLowerCase().includes(lowerSearch) ||
          item?.mobile?.toLowerCase().includes(lowerSearch) ||
          item?.role?.toLowerCase().includes(lowerSearch) ||
          item?.circuitId?.toLowerCase().includes(lowerSearch) ||
          item?.fabCircuitId?.toLowerCase().includes(lowerSearch)
        );
      });

      setFilteredData(results);
    }, 300); // 300ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [search, dataSource, setFilteredData]);

  const handleChange = (e) => setSearch(e.target.value);
  return (
    <form
      action=""
      className="  h-full flex md:hidden  items-center p-2 pl-0 gap-2 w-full "
    >
      <label htmlFor="" className="text-xl h-full flex items-center pl-2">
        <CiSearch />
      </label>
      <input
        type="text"
        placeholder="Search"
        className=" flex-1 outline-none"
        onChange={handleChange}
      />
    </form>
  );
}

export default MobileSearchBar;
