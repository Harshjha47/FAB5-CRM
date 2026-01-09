import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useAuth } from "../../Context/AuthContext";
import { useCustomer } from "../../Context/CustomerContext";

function SearchBar() {
  const { profileData } = useAuth();
  const [search, setSearch] = useState();
  const { filteredData, setFilteredData } = useCustomer();
  const customarRefrence = profileData?.customers;
    const handleChange=(e)=>{
    const {name, value}=e.target
    setSearch(value)
  }
  useEffect(() => setFilteredData(customarRefrence), [customarRefrence]);

  useEffect(() => {
    setFilteredData(
      customarRefrence?.filter((e) => {
        return (
          e?.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
          e?.circuitId?.toLowerCase()?.includes(search?.toLowerCase())
        );
      })
    );
  }, [search]);
  useEffect(() => setFilteredData(customarRefrence), []);
  return (
    <form
      action=""
      className="h-full flex items-center p-2 pl-0 gap-2 w-[40%] "
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
