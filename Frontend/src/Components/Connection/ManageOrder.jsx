import React, { useEffect, useState } from "react";
import { useConnection } from "../../Context/ConnectionContext";
import { Link, useParams } from "react-router-dom";
import EditConnection from "./EditConnection";
import ShiftConnection from "./ShiftConnection";
import Disconnect from "../Dashboard/Disconnect";
import Extend from "../Dashboard/Extend";
import Retain from "../Dashboard/Retain";
import AddIp from "./AddIp";
import { useAuth } from "../../Context/AuthContext";
import { 
  Settings2, 
  Truck, 
  Server, 
  PowerOff, 
  CalendarClock, 
  ShieldCheck, 
  AlertCircle,
  ArrowLeft
} from "lucide-react";

function ManageOrder() {
  const { getConnectionById, singleConnectionData } = useConnection();
  const [data, setData] = useState(singleConnectionData);
  const [tabs, setTabs] = useState("");

  const { user } = useAuth();
  const { cid } = useParams();

  useEffect(() => {
    setData(singleConnectionData);
  }, [singleConnectionData]);

  useEffect(() => {
    if (cid) getConnectionById(cid);
  }, [cid, getConnectionById]);

  useEffect(() => {
    if (data?.status === "Active" && !tabs) setTabs("edit");
    if (data?.status === "Notice Period" && !tabs) setTabs("Extend");
  }, [data, tabs]);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (data?.status === "Pending") {
    return (
      <section className="flex justify-center items-center h-[80vh] p-4 bg-slate-50/50">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8  w-full flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Connection Not Active</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            This connection is currently marked as <span className="font-semibold text-amber-600">Pending</span>. You can only manage orders that are Active or in their Notice Period.
          </p>
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95"
          >
            <ArrowLeft size={18} /> Return to Dashboard
          </Link>
        </div>
      </section>
    );
  }

  const activeTabs = [
    { id: "edit", label: "Upgrade / Downgrade / Rate Revision", icon: Settings2 },
    { id: "shift", label: "Shift Connection", icon: Truck },
    { id: "add", label: "Additional IP", icon: Server },
    { id: "dis", label: "Disconnect", icon: PowerOff, color: "text-rose-500 hover:text-rose-600 hover:bg-rose-50" },
  ];

  const noticePeriodTabs = [
    { id: "Extend", label: "Extend Notice", icon: CalendarClock },
    { id: "Retain", label: "Retain Connection", icon: ShieldCheck },
  ];

  const currentTabs = data?.status === "Notice Period" ? noticePeriodTabs : activeTabs;

  return (
    <section className="min-h-screen bg-slate-50/50 ">
      <div className=" mx-auto flex flex-col gap-6">
        
        

        <nav className="w-full bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm overflow-x-auto hide-scrollbar">
          <ul className="flex gap-1 min-w-max">
            {currentTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tabs === tab.id;
              
              const activeClass = isActive 
                ? "bg-indigo-50 text-indigo-700 shadow-sm border-indigo-100 font-bold" 
                : "text-slate-600 hover:bg-slate-100 font-medium border-transparent";
              
              const specialClass = !isActive && tab.color ? tab.color : "";

              return (
                <li key={tab.id} className="flex-1">
                  <button
                    onClick={() => setTabs(tab.id)}
                    className={`w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-lg border transition-all whitespace-nowrap ${activeClass} ${specialClass}`}
                  >
                    <Icon size={18} className={isActive ? "" : "opacity-70"} />
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Tab Content Wrapper */}
        <div className="w-full ">
          {data?.status === "Active" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {tabs === "edit" && <EditConnection info={data} />}
              {tabs === "shift" && <ShiftConnection info={data} />}
              {tabs === "dis" && <Disconnect info={data} />}
              {tabs === "add" && <AddIp info={data} />}
            </div>
          )}

          {data?.status === "Notice Period" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {tabs === "Extend" && <Extend info={data} />}
              {tabs === "Retain" && <Retain info={data} />}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

export default ManageOrder;