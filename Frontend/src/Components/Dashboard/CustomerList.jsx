import React, { useEffect } from "react";
import CustomerCard from "./CustomerCard";
import { useAuth } from "../../Context/AuthContext";
import { useCustomer } from "../../Context/CustomerContext";
import ConnectionCard from "../Connection/ConnectionCard";
import { GrAdd } from "react-icons/gr";
import { Link } from "react-router-dom";

function CustomerList() {
  const { profileData,allData } = useAuth();
  const { filteredData, setFilteredData ,getAllCustomer} = useCustomer();
  
  


  return (
    <section className="flex flex-col p-2 gap-2">
      <Link to={"/customers/add"} className="border p-6 bg-white text-xl rounded-xl shadow-md flex gap-4 items-center "><GrAdd/>Add Custommer</Link>
      {filteredData?.customer?.map((e, i) =><CustomerCard key={i} information={e} />
        
        )}
    </section>
  );
}

export default CustomerList;
