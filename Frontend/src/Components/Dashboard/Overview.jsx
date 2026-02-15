import React from "react";
import { MdArrowOutward } from "react-icons/md";
import { useAuth } from "../../Context/AuthContext";
import { Link } from "react-router-dom";
import { useCustomer } from "../../Context/CustomerContext";

function Overview() {
  const { allData, profileData } = useAuth();
    const { filteredData, setFilteredData ,getAllCustomer} = useCustomer();
  

  const list =
    profileData?.role == "employee"
      ? [
          {
            title: "Totel Customer",
            count: filteredData?.customer?.length,
            reference: "/customers",
            color: "#22C55E",
            items: filteredData?.customer,
          },
          {
            title: "Totel Opportunities",
            count: filteredData?.connections?.length,
            reference: "/connections",
            color: "#F97316",
            items: filteredData?.connections,
          },
        ]
      : [
          {
            title: "Total Employees",
            count: filteredData?.users?.length,
            reference: "/employees",
            color: "#3B82F6",
            items: filteredData?.users,
          },
          {
            title: "Total Customer",
            count: filteredData?.customer?.length,
            reference: "/customers",
            color: "#22C55E",
            items: filteredData?.customer,
          },
          {
            title: "Total Opportunities",
            count: filteredData?.connections?.length,
            reference: "/connections",
            color: "#F97316",
            items: filteredData?.connections,
          },
        ];
  return (
    <div className="flex gap-2 h-[90vh] p-2 flex-wrap justify-between ">
      {list?.map((e, i) => (
        <div key={i} className="  flex-1 flex flex-col gap-2">
          <Link
            to={e?.reference}
            className="w-full   text-white rounded-xl flex flex-col items-start p-4"
            style={{ backgroundColor: `${e?.color}` }}
          >
            <div className="h-full flex-1  rounded-md flex text-xl  w-full justify-between items-center gap-2">
              {e.title}
              <span className="border p-3 text-lg text-black bg-white rounded-full">
                <MdArrowOutward />
              </span>
            </div>

            <div className=" flex gap-2 items-center w-full ">
              <div className="   text-6xl  bg-[#ffffff00]  gap-1">
                {e?.count}
              </div>
            </div>
          </Link>
          <div className="w-full h-[65vh] rounded-xl customScroller min-h-0 overflow-y-auto flex gap-2 flex-col p-2 bg-white">
            {e?.items?.map((a, i) => (
              <div key={i} className="border p-2 rounded-lg ">
                <div className="flex justify-between items-center">
                  {a?.name || a?.customer?.name}
                  {!a?.person && (
                    <span
                      className=" text-[0.65rem] px-3 p-1 leading-none rounded-full flex justify-center items-center"
                      style={{
                        backgroundColor: `${a?.role == "employee" || a?.status == "Active" ? "#00d1003d" : a?.role == "admin" ? "#00000027" : "#ff880027"}`,
                        color: `${a?.role == "employee" ? "#003a00" : a?.role == "admin" ? "#000000" : "#3f2400"}`,
                      }}
                    >
                      {a?.role || a?.status}
                    </span>
                  )}
                </div>
                <div className="flex justify-between gap-2 items-center text-xs">
                  {a?.email}
                  {a?.person && <span>{a?.person}</span>}
                  {a?.bandwidth && <div className="">{a?.bandwidth}Mbps</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Overview;
