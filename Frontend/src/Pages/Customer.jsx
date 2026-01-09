import React, { useEffect, useState } from "react";
import CustomerNavBar from "../Components/Navigation/CustomerNavBar";
import CustomerCard from "../Components/Dashboard/CustomerCard";
import { Outlet, useParams } from "react-router-dom";
import { useCustomer } from "../Context/CustomerContext";

function Customer() {
  const { customerInformation, setCustomerImformation, getCustomerById } =
    useCustomer();
  const { id } = useParams();
  useEffect(() => {
    getCustomerById(id);
  }, []);
  return (
    <main className="flex flex-col h-screen">
      <CustomerNavBar />
      <section className="flex-1 w-full border p-2 flex gap-2">
        <aside className="w-[25%] p-2 flex flex-col">
          <CustomerCard information={customerInformation}/>
        </aside>
        <section className="h-[85vh] customScroller flex-1 p-2 overflow-y-scroll">
          <Outlet />
        </section>
      </section>
    </main>
  );
}

export default Customer;
