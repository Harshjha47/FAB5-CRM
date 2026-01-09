import React, { useState } from "react";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import CustomerDetailCard from "./CustomerDetailCard";
import { useCustomer } from "../../Context/CustomerContext";
import { useParams } from "react-router-dom";

function CustomerSumDetails() {
    const { customerInformation, setCustomerImformation, getCustomerById } =
    useCustomer();
  const { id } = useParams();
  return (
    <section className="w-full flex flex-col gap-2 h-full ">
      {customerInformation?.activityLog?.map((e,i)=>{
        return <CustomerDetailCard key={i} info={e}/>

      })}
    </section>
  );
}

export default CustomerSumDetails;
