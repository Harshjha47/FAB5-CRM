import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useAuth } from "../../Context/AuthContext";
import { useCustomer } from "../../Context/CustomerContext";
import { useLocation } from "react-router-dom";

function MobileSearchBar() {
  const { profileData, getAllUser, allProfileData, setAllProfileData } =
    useAuth();
  const [search, setSearch] = useState();
  const location = useLocation();

  const {
    filteredData,
    setFilteredData,
    customerlist,
    setCustomerList,
    getAllCustomer,
  } = useCustomer();

  useEffect(() => {
    getAllCustomer();
    getAllUser();
  }, []);
  const filterDataContent = () => {
    if (profileData?.role == "admin") {
      if (location.pathname.includes("team")) {
        return allProfileData;
      } else {
        return customerlist;
      }
    } else {
      return profileData?.customers;
    }
  };

  const customarRefrence = filterDataContent();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearch(value);
  };
  useEffect(() => setFilteredData(customarRefrence), [customarRefrence]);

  useEffect(() => {
    setFilteredData(
      customarRefrence?.filter((e) => {
        return (
          e?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
          e?.email?.toLowerCase()?.includes(search?.toLowerCase()) ||
          e?.phone?.toLowerCase()?.includes(search?.toLowerCase()) ||
          e?.role?.toLowerCase()?.includes(search?.toLowerCase()) ||
          e?.circuitId?.toLowerCase()?.includes(search?.toLowerCase())
        );
      })
    );
  }, [search]);
  useEffect(() => setFilteredData(customarRefrence), []);
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
