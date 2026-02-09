import React, { useEffect } from "react";
import CustomerCard from "./CustomerCard";
import { useAuth } from "../../Context/AuthContext";
import { useCustomer } from "../../Context/CustomerContext";
import ConnectionCard from "../Connection/ConnectionCard";

function CustomerList() {
  const { profileData } = useAuth();
  const { filteredData, setFilteredData ,getAllCustomer} = useCustomer();
  


  return (
    <section className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-3">
      {filteredData?.map((e, i) => ["project", "owner"].includes(profileData?.role)?<ConnectionCard key={i} information={e} />:<CustomerCard key={i} information={e} />
        
        )}
    </section>
  );
}

export default CustomerList;
