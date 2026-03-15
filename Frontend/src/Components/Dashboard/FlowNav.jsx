import React from 'react'
import { Link } from "react-router-dom";
import { Active, Approved, ArrowForward, Churn, Generate, Manage, Pending } from "../Icons/Icons";

function FlowNav() {
    const list = [
    {
      name: "Pending Approvel",
      url: "",
      Active: true,
      value: "",
      style:"#FFC355",
      icon:Pending
    },
    {
      name: "Order Approved",
      url: "",
      Active: true,
      value: "",
      style:"#4E4EFF",
      icon:Approved
    },
    {
      name: "Order Generation",
      url: "",
      Active: true,
      value: "",
      style:"#DCEE64",
      icon:Generate
    },
    {
      name: "Order In Process",
      url: "",
      Active: true,
      value: "",
      style:"#A69DEE",
      icon:Manage
    },
    {
      name: "Order Active ",
      url: "",
      Active: true,
      value: "",
      style:"#3FFF3F",
      icon:Active
    },
    {
      name: "Termination Pending",
      url: "",
      Active: true,
      value: "",
      style:"#FFCC6D",
      icon:Pending
    },
    {
      name: "Chrun",
      url: "",
      Active: true,
      value: "",
      style:"#FF6B6B",
      icon:Churn
    },
  ];
  return (
    <section className=" rounded-xl  bg-[#0000ff13] p-4 flex gap-4 flex-wrap">
        {list?.map((e, i) =>  e.Active && <div key={i} className="p-2 items-center flex gap-2">
              <div className=" h-[7vh] aspect-square text-white text-2xl rounded-md flex justify-center items-center"
                style={{background:e.style}}
                >
                  {e.icon && <e.icon />}
                </div>
                <div className="">
                  <h5 className="text-xs flex gap-1  items-center">
                    <Link to={e.url} className="text-[blue]">{e.name || "N/A"} </Link>
                    <span className="text-[blue]"><ArrowForward/></span>
                  </h5>
                  <p className="font-semibold text-xl">{e.value || "0"}</p>
                </div>
              </div>
        )}
      </section>
  )
}

export default FlowNav