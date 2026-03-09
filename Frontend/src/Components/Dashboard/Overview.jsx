
import DashboardLists from "./DashboardLists";
import FlowNav from "./FlowNav";

function Overview() {
  const list=[
    {
      name:"Revenue",
      value:"",
    },
    {
      name:"Activation",
      value:"",
    },
    {
      name:"Churn rate",
      value:"",
    },
    {
      name:"Delivery rate",
      value:"",
    },
  ]
  
  return (
    <section className="flex gap-6 flex-col h-[90vh] overflow-auto py-2 px-4 ">
      <FlowNav/>
      <section className="  h-[65vh] flex gap-6">
        <DashboardLists/>
        
        <section className="rounded-xl overflow-hidden border h-[60vh] flex-1">
          <div className="bg-[#00ff731f]  justify-center items-center flex w-full  h-[7vh] pt-1 px-1">
            <h2 className="w-[80%] font-semibold">Performance</h2>
          </div>
          {list?.map((e,i)=>{
            return(
<div key={i} className="bg-white p-2 px-6 border-b flex justify-between items-center">
            <div className="">{e.name}</div>
            <div className="">{e.value || "N/A"}</div>
          </div>
            )
          })}
          
        </section>
        
      </section>
    </section>
  );
}

export default Overview;
