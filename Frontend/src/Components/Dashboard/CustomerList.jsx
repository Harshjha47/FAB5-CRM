import React, { useEffect } from "react";
import CustomerCard from "./CustomerCard";
import { useAuth } from "../../Context/AuthContext";
import { useCustomer } from "../../Context/CustomerContext";

function CustomerList() {
  const { profileData } = useAuth();
  const { filteredData, setFilteredData ,getAllCustomer} = useCustomer();


  return (
    <section className="grid gap-3 grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 pb-3">
      {filteredData?.map((e, i) => {
        return <CustomerCard key={i} information={e} />;
      })}
    </section>
  );
}

export default CustomerList;
