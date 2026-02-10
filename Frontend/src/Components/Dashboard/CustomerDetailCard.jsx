import { useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { RiCloseLargeLine } from "react-icons/ri";
import { useCustomer } from "../../Context/CustomerContext";
import ActionDetails from "./ActionDetails";

function CustomerDetailCard({ info }) {
  const [details, setDetails] = useState(true);
  const { customerInformation } = useCustomer();
  

  return (
    <article onClick={() => setDetails(!details)} className="w-full cursor-pointer border flex flex-col rounded">
      <div className="w-full  p-2 flex justify-between items-center leading-[1]">
        <div className="">
          <h3 className="font-semibold">
            {info?.bandwidth}Mbps
          </h3>
          <p className="text-xs text-zinc-400">{info?._id}</p>
        </div>
        <div
          onClick={() => setDetails(!details)}
          className="text- border rounded p-2"
        >
          {details ? <CiMenuKebab /> : <RiCloseLargeLine />}
        </div>
      </div>
      <div className={` ${details ? "hidden" : "flex"} text-sm`}>
        <ActionDetails logInfo={info._id} />
      </div>
    </article>
  );
}

export default CustomerDetailCard;
