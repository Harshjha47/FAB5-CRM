import React from "react";
import { CiUser } from "react-icons/ci";
import TeamMembers from "./TeamMembers";
import { useCustomer } from "../../Context/CustomerContext";

function Team() {
     const {
        filteredData,
        setFilteredData,
        customerlist,
        setCustomerList,
        getAllCustomer,
      } = useCustomer();
  return (
     

    <section className="grid gap-3 grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 pb-3">
        {filteredData?.map((e,i)=><TeamMembers key={i} information={e}/>)}
      
    </section>
  );
}

export default Team;
