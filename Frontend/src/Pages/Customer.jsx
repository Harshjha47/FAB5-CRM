import React, { useEffect, useState } from "react";
import CustomerNavBar from "../Components/Navigation/CustomerNavBar";
import { Outlet, useParams } from "react-router-dom";
import { useCustomer } from "../Context/CustomerContext";
import CustomerCardSecond from "../Components/Dashboard/CustomerCardSecond";

function Customer() {
  const { customerInformation, getCustomerById } = useCustomer();
  const { id } = useParams();
  useEffect(() => {
    getCustomerById(id);
  }, []);

  return (
    <main className="flex flex-col h-screen">
      <CustomerNavBar />
      <section className="flex-1 w-full  p-2 flex gap-2 ">
        <aside className="w-[25%] p-2 md:flex hidden flex-col gap-4 h-[85vh] overflow-scroll customScroller ">
          <CustomerCardSecond information={customerInformation} />

          <h3 className="text-xl">Manage by</h3>

          <section
            className="border border-[#99999910] bg-[#fff] shadow-md p-5 rounded-2xl flex flex-col gap-3"
          >
            <div className="w-full  p-2 flex flex-col items-start">
              <h3 className="font-semibold">{customerInformation?.managedBy?.name}</h3>
              <p
                className={` text-xs py-[2px] flex gap-1  text-[#1d1d1d] rounded-md  opacity-80  justify-center items-center`}
              >
                {customerInformation?.managedBy?.role}
              </p>
            </div>
            <div className=" flex gap-2 flex-col items-start justify-between">
              <h4 className="text-xs border font-semibold text-zinc-400 px-2 p-[1px] rounded">
                {customerInformation?.managedBy?.email}
              </h4>
              <h4 className="text-xs border font-semibold text-zinc-400 px-2 p-[1px] rounded">
                {customerInformation?.managedBy?.phone}
              </h4>
            </div>
          </section>
          <h3 className="text-xl">Billing Profiles</h3>

          {customerInformation?.billingProfiles?.map((e,i)=>{
            return (
              <section
              key={i}
            className="border border-[#99999910] bg-[#fff] shadow-md p-5 rounded-2xl flex flex-col gap-3"
          >
            <div className="w-full  p-2 flex flex-col items-start">
              <h3 className="font-semibold">{e?.label}</h3>
              <p
                className={` text-xs py-[2px] flex gap-1  text-[#1d1d1d] rounded-md  opacity-80  justify-center items-center`}
              >
                {e?.gstNumber}
              </p>
            </div>
          </section>

            )
          })}

          
        </aside>
        <section className="h-[85vh] borer border-black customScroller flex-1 p-2 overflow-y-scroll">
          <Outlet />
        </section>
      </section>
    </main>
  );
}

export default Customer;
