import { useAuth } from "../../Context/AuthContext";
import SearchBar from "../Navigation/SearchBar";
import EmployeeDashboard from "./EmployeeDashboard";
import FlowNav from "./FlowNav";

function Overview() {
  const { allData,user } = useAuth()


  const totalAllConnections =(allData?.connections?.filter((e)=>e.status==="Active"))?.reduce((sum, conn) => {
    return sum + (conn?.commercials?.mrc || 0) + (conn?.commercials?.otc || 0);
  }, 0);



  const list = [
    {
      name: "Life Time Revenue",
      value: totalAllConnections,
    },
    {
      name: "Total Customers",
      value: allData?.customers?.length,
    },
    {
      name: "Total Opportunities",
      value: allData?.connections?.length,
    },
    {
      name: "Activation",
      value: `${Math.round((allData?.connections?.filter((e) => e.status === "Active")?.length / allData?.connections?.length) * 100)}%`,
    },
    {
      name: "Churn rate",
      value: `${Math.round((allData?.connections?.filter((e) => e.status === "Disconnected")?.length / allData?.connections?.length) * 100)}%`,
    },
  ];

  return (
    <section className="flex gap-6 flex-col h-[90vh] customScroller overflow-auto py-2 px-4 ">

      <div className="flex">
        <SearchBar />
        {/* <AllFilter /> */}
      </div>
    {(user?.role === "employee"||user?.role === "admin" )&&<FlowNav />}
      
      <section className="  h-[65vh] flex gap-6 flex-col md:flex-row">
        {/* <DashboardLists /> */}
        <EmployeeDashboard />
{(user?.role=="employee" || user?.role=="admin")&&
<section className="rounded-xl bg-white overflow-auto border max-h-[50vh] min-h-[50vh] flex-1">
          <div className="bg-[#00ff731f]  justify-center items-center flex w-full  h-[7vh] pt-1 px-1">
            <h2 className="w-[80%] font-semibold">Performance</h2>
          </div>
          {list?.map((e, i) => {
            return (
              <div
                key={i}
                className="bg-white p-2 px-6 border-b flex justify-between items-center"
              >
                <div className="">{e.name}</div>
                <div className="">{e.value || "N/A"}</div>
              </div>
            );
          })}
        </section>}
        
      </section>
    </section>
  );
}

export default Overview;
