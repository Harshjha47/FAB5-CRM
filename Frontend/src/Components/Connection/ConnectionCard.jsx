import React, { useState } from "react";
import { InputUnit } from "../Utils/InputUnit";
import { useAuth } from "../../Context/AuthContext";
import { useConnection } from "../../Context/ConnectionContext";

function ConnectionCard({ information }) {
  const { profileData, getAllUser, allProfileData } = useAuth();
  const {approveConnection,activeConnection}=useConnection()
  const [init, setInit] = useState({
    fabCircuitId: "",
    talcoCircuitId: "",
  });
  const { fabCircuitId, talcoCircuitId } = init;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInit({ ...init, [name]: value });
  };
  const handleSubmit=(e)=>{
    e.preventDefault()
    activeConnection(information?._id,init)
  }

  return (
    <div className="border border-[#99999910] bg-[#fff] shadow-md p-5 rounded-2xl flex flex-col gap-3">
      <div className="">
        <div className="text-xl">{information?.bandwidth}Mbps</div>
        <div className="text-sm">{information?.customer?.name}</div>
      </div>

      <div className="flex gap-1">
        <div className="text-sm border px-2 rounded-md">
          {information?.serviceType}
        </div>
        <div className="text-sm border px-2 rounded-md">
          {information?.technicalDetails?.telcoProvider}
        </div>
      </div>
      <h4>BTS ID</h4>
      <div className="flex gap-1">
        <div className="text-sm border px-2 rounded-md">
          A : {information?.technicalDetails?.aEnd?.btsId}
        </div>
        <div className="text-sm border px-2 rounded-md">
          B : {information?.technicalDetails?.bEnd?.btsId}
        </div>
      </div>
      <h4>Address</h4>
      <div className="flex gap-1 flex-wrap">
        <div className="text-sm border px-2 rounded-md">
          A : {information?.technicalDetails?.aEnd?.address}
        </div>
        <div className="text-sm border px-2 rounded-md">
          B : {information?.technicalDetails?.bEnd?.address}
        </div>
      </div>
      {profileData?.role == "owner" && (
        <>
          <h4>Pricing</h4>
          <div className="flex gap-1 flex-wrap">
            <div className="text-sm border px-2 rounded-md">
              Advance : {information?.commercials?.advance}
            </div>
            <div className="text-sm border px-2 rounded-md">
              MRC : {information?.commercials?.mrc}
            </div>
            <div className="text-sm border px-2 rounded-md">
              OTC : {information?.commercials?.otc}
            </div>
            <div className="text-sm border px-2 rounded-md">
              Rate Per Mb : {information?.commercials?.ratePerMb}
            </div>
          </div>
          <div className="flex gap-1 flex-wrap">
            <div onClick={()=>approveConnection(information?._id)} className=" cursor-pointer text-sm text-white font-semibold bg-green-500 border flex-1 justify-center flex items-center p-2 rounded-md">
              Approve{" "}
            </div>
            {/* <div className="text-sm text-white font-semibold bg-red-500 border flex-1 justify-center flex items-center p-2 rounded-md">
              Denial{" "}
            </div> */}
          </div>
        </>
      )}
      {profileData?.role == "project" && 
      (
        <form action="" onSubmit={handleSubmit} className="flex flex-col gap-3">
          <InputUnit
            type="text"
            placeholder="FAB Circuit ID"
            name="fabCircuitId"
            value={fabCircuitId}
            change={handleChange}
          />
          <InputUnit
            type="text"
            placeholder="Telecom Circuit ID"
            change={handleChange}
            name="talcoCircuitId"
            value={talcoCircuitId}
          />
          <button
            type="submit"
            className="border p-2 rounded-md text-white font-semibold bg-green-500"
          >
            Activate
          </button>
        </form>
      )}
    </div>
  );
}

export default ConnectionCard;
