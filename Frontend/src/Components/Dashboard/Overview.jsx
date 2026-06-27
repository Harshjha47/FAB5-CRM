import { useAuth } from "../../Context/AuthContext";
import { useDashboard } from "../../Context/DashboardContext";
import SearchBar from "../Navigation/SearchBar";
import EmployeeDashboard from "./EmployeeDashboard";
import FlowNav from "./FlowNav";

function Overview() {
  const { user } = useAuth();
  const { metrics, loadingMetrics } = useDashboard(); 
  

  const list = [
    {
      name: "Life Time Revenue",
      value: loadingMetrics 
        ? "Loading..." 
        : metrics?.performance?.lifeTimeRevenue !== undefined 
          ? `${Math.round(metrics.performance.lifeTimeRevenue)}` 
          : "0",
    },
    {
      name: "Total Customers",
      value: loadingMetrics ? "..." : metrics?.performance?.totalCustomers ?? 0,
    },
    {
      name: "Total Opportunities",
      value: loadingMetrics ? "..." : metrics?.performance?.totalOpportunities ?? 0,
    },
    {
      name: "Activation",
      value: loadingMetrics ? "..." : `${metrics?.performance?.activationRate ?? 0}%`,
    },
    {
      name: "Churn rate",
      value: loadingMetrics ? "..." : `${metrics?.performance?.churnRate ?? 0}%`,
    },
  ];

  return (
    <section className="flex gap-6 flex-col h-[90vh] customScroller overflow-auto py-2 px-4 ">

      <div className="flex">
        <SearchBar />
      </div>
      {(user?.role === "employee" || user?.role === "admin") && <FlowNav />}

      <section className="  h-[65vh] flex gap-6 flex-col md:flex-row">
        <EmployeeDashboard />
        {(user?.role == "employee" || user?.role == "admin") &&
          <section className="rounded-xl bg-white overflow-auto border max-h-[50vh] min-h-[50vh] flex-1">
            <div className="bg-[#00ff731f]  justify-center items-center flex w-full  h-[7vh] pt-1 px-1">
              <h2 className="w-[80%] font-semibold">Performance</h2>
            </div>
            {list?.map((e) => {
              return (
                <div
                  key={e.name}
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