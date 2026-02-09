import React, { useEffect, useState, useMemo } from "react";
import { CiSearch } from "react-icons/ci";
import { useAuth } from "../../Context/AuthContext";
import { useCustomer } from "../../Context/CustomerContext";
import { useLocation } from "react-router-dom";
import { useConnection } from "../../Context/ConnectionContext";

function SearchBar() {
  const { profileData, getAllUser, allProfileData } = useAuth();
  const { connectionData,getProjectConnection } = useConnection();
  const { customerlist, setFilteredData, getAllCustomer } = useCustomer();
  const location = useLocation();

  const [search, setSearch] = useState("");

  // 1. Fetch data once on mount
  useEffect(() => {
    profileData?.role == "admin" && getAllUser();
  }, []);

  useEffect(()=>{
    if(["project", "owner"].includes(profileData?.role)){
    getProjectConnection()
    }else{
    getAllCustomer();

    }
  },[profileData])

  const dataSource = useMemo(() => {
    if (profileData?.role === "admin") {
      return location.pathname.includes('team') ? allProfileData : customerlist;
    }
    if (["project", "owner"].includes(profileData?.role)) {
      return connectionData;
    }
    if (profileData?.role === "employee") {
      return profileData?.customers || [];
    }
    return [];
  }, [profileData, location.pathname, allProfileData, customerlist, connectionData]);

  // 3. Effect for Filtering Logic
  useEffect(() => {
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
  }, [search, dataSource, setFilteredData]);

  const handleChange = (e) => setSearch(e.target.value);

  return (
    <form
      action=""
      className="h-full hidden items-center p-2 pl-0 gap-2 w-[40%] md:flex"
    >
      <label
        htmlFor=""
        className="text-xl border-l h-full flex items-center pl-2"
      >
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

export default SearchBar;
