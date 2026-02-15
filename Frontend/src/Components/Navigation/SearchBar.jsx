import React, { useEffect, useState, useMemo } from "react";
import { CiSearch } from "react-icons/ci";
import { useAuth } from "../../Context/AuthContext";
import { useCustomer } from "../../Context/CustomerContext";

function SearchBar() {
  const { getAllUser, allData } = useAuth();
  const { setFilteredData } = useCustomer();
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllUser();
  }, []);

  const dataSource = useMemo(() => allData, [allData]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredData(dataSource);
      return;
    }

    const lowerSearch = search.toLowerCase();

    // 1. Filter Users
    const users = dataSource?.users?.filter((item) => {
      return (
        item?.name?.toLowerCase().includes(lowerSearch) ||
        item?.email?.toLowerCase().includes(lowerSearch) ||
        item?.role?.toLowerCase().includes(lowerSearch)
      );
    }) || [];

    // 2. Filter Customers (Note: key matches backend 'customer')
    const customer = dataSource?.customer?.filter((item) => {
      return (
        item?.name?.toLowerCase().includes(lowerSearch) ||
        item?.email?.toLowerCase().includes(lowerSearch) ||
        item?.person?.toLowerCase().includes(lowerSearch)
      );
    }) || [];

    // 3. Filter Connections
    const connections = dataSource?.connections?.filter((item) => {
      const customerName = item?.customer?.name || "";
      return (
        customerName.toLowerCase().includes(lowerSearch) ||
        item?.serviceType?.toLowerCase().includes(lowerSearch) ||
        item?.status?.toLowerCase().includes(lowerSearch) ||
        item?.bandwidth?.toString().includes(lowerSearch) ||
        item?.fabCircuitId?.toLowerCase().includes(lowerSearch)
      );
    }) || [];

    setFilteredData({ users, connections, customer });
  }, [search, dataSource, setFilteredData]);

  const handleChange = (e) => setSearch(e.target.value);

  return (
    <form
      action=""
      className="h-[10vh]  items-center p-2 pl-0 gap-2 w-[40%] flex"
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
        className=" flex-1 outline-none bg-transparent"
        onChange={handleChange}
      />
    </form>
  );
}

export default SearchBar;
