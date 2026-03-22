import { Search } from "../Icons/Icons";
import { useAuth } from "../../Context/AuthContext";
import DashboardListIteam from "./DashboardListIteam";

function DashboardLists() {
  const {tab, setTab,allData} = useAuth();

  
  const NavButtonList = [
    {
      name: "Customers",
      Active: true,
    },
    {
      name: "Opportunities",
      Active: true,
    },
    {
      name: "Employees",
      Active: true,
    },
  ];
  const subHeading = [
    {
      name: "UID",
      Active: tab=="Opportunities",
    },
    {
      name: "Name",
      Active: true,
    },
     {
      name: "Role",
      Active: tab=="Employees",
    },
    {
      name: "Service",
      Active: tab=="Opportunities",
    },
    {
      name: "Status",
      Active: tab=="Opportunities",
    },
    {
      name: "Opportunities",
      Active: tab=="Customers",
    },
    {
      name: "Action",
      Active: true,
    },
  ];
  const getListData = () => {
    if (!allData) return []; // Safety check if allData is null
    
    switch (tab) {
      case "Opportunities":
        return allData.connections || [];
      case "Customers":
        return allData.customers || [];
      case "Employees":
        return allData.users || [];
      default:
        return [];
    }
  };

  const currentList = getListData();
  return (
    <section className="min-h-[60vh] flex-[3] border rounded-xl overflow-hidden">
      <div className="bg-[#0000ff13]  flex w-full text-[#363636] h-[7vh] pt-1 px-1">
        {NavButtonList?.map(
          (e, i) =>
            e.Active && (
              <h2
                key={e.name || i}
                onClick={() => setTab(e.name)}
                className={`rounded-t-xl flex-1 flex justify-center cursor-pointer items-center transition-colors ${
                  e.name === tab
                    ? "bg-white text-black font-semibold"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {e.name}
              </h2>
            ),
        )}
      </div>
      <div className=" w-full py-1  gap-2 flex">
        {subHeading?.map(
          (e, i) =>
            e.Active && <h3 key={i} className="flex-1 text-center">{e.name}</h3>,
        )}
      </div>
      <div className=" w-full flex p-2 gap-2 ">
        {/* <div className="bg-white flex items-center gap-2 p-2 rounded-xl flex-1"><span className="text-2xl "><Search/></span><input type="text" placeholder="Search" className="flex-1 text-lg px-2 outline-none"/></div>
        <div className="w-[30%]">
            <select name="" className="h-full rounded-xl outline-none w-full flex justify-center items-center pl-4" id="">
                <option value="" className="">All</option>
            </select>
        </div> */}
        
        
      </div>
      <div className="w-full customScroller flex gap-2 flex-col h-[60%] overflow-auto ">
        {currentList.length > 0 ? (
          currentList.map((e, i) => (
            <DashboardListIteam key={i} information={e} />
          ))
        ) : (
          <p className="text-center py-4 text-gray-400">No data found</p>
        )}
            

        </div>
    </section>
  );
}

export default DashboardLists;
