import React from 'react'
import { Link } from "react-router-dom";
import { Active, Approved, ArrowForward, Churn, Generate, Manage, Pending } from "../Icons/Icons";
import { useAuth } from '../../Context/AuthContext';
import { useDashboard } from '../../Context/DashboardContext'; // 1. Import our fresh optimized hook
import { useEffect } from 'react';

const list = [
  { name: "Commercial Approval", url: "/connections", Active: true, value: "Pending", style:"#FFC355", icon:Pending, keyName: "commercialApproval" },
  { name: "Order Approved", Active: true, value: "Approved", style:"#4E4EFF", icon:Approved, keyName: "orderApproved" },
  { name: "Implementation", Active: true, value: "Generation", style:"#DCEE64", icon:Generate, keyName: "implementation" },
  { name: "Active Links", Active: true, value: "Active", style:"#3FFF3F", icon:Active, keyName: "activeLinks" },
  { name: "Termination Pending", Active: true, value: "Notice Period", style:"#FFCC6D", icon:Pending, keyName: "terminationPending" },
  { name: "Churned Link", Active: true, value: "Disconnected", style:"#FF6B6B", icon:Churn, keyName: "churnLink" },
];

function FlowNav() {
  const app = [, "Approved","Generation","Process", "Active", "Notice Period", "Disconnected"]
  const { setActiveTab, setStatusFilter } = useAuth();
  const { metrics, loadingMetrics } = useDashboard();

  
  
  const filterSelect = (e) => {
    setStatusFilter(e);
    setActiveTab("connections");
  };

  const getValueForCard = (keyName) => {
    if (loadingMetrics) return "...";
    return metrics?.counters?.[keyName] ?? 0;
  };

  return (
    <section className=" rounded-xl select-none bg-[#0000ff13] p-4 flex gap-4 flex-wrap">
        {/* FIX APPLIED: Used e.name instead of i */}
        {list?.map((e) =>  e.Active && <div key={e.name} className="p-2 items-center flex gap-2">
              <div className=" h-[7vh] aspect-square text-white text-2xl rounded-md flex justify-center items-center"
                style={{background:e.style}}
                >
                  {e.icon && <e.icon />}
                </div>
                <div className="">
                  <h5 className="text-xs flex gap-1  items-center">
                    <div onClick={()=>{filterSelect(e.value)}} className="text-[blue] cursor-pointer">{e.name || "N/A"} </div>
                    <span className="text-[blue]"><ArrowForward/></span>
                  </h5>
                  <p className="font-semibold text-xl">{getValueForCard(e.keyName)}</p>
                </div>
              </div>
        )}
      </section>
  )
}

export default FlowNav;