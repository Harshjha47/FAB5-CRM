import { useState } from "react";
import { CiMenuKebab } from "react-icons/ci";
import { RiCloseLargeLine } from "react-icons/ri";
import { useCustomer } from "../../Context/CustomerContext";
import ActionDetails from "./ActionDetails";

function CustomerDetailCard({ info }) {
  const [details, setDetails] = useState(true);

  return (
    <article className="w-full bg-white border flex flex-col rounded-lg shadow-md p-2">
      <div className="w-full p-2 flex justify-between items-center leading-[1]">
        <div>
          <h3 className="font-semibold">{info?.bandwidth}Mbps</h3>
          <p className="text-xs text-zinc-400">{info?.opportunityId}</p>
        </div>
        {/* FIX: Swapped div for button with aria-label */}
        <button
          type="button"
          aria-label={details ? "Open details" : "Close details"}
          onClick={() => setDetails(!details)}
          className="border rounded p-2 flex items-center justify-center text-zinc-600 cursor-pointer"
        >
          {details ? <CiMenuKebab /> : <RiCloseLargeLine />}
        </button>
      </div>
      <div className={` ${details ? "hidden" : "flex"} text-sm`}>
        <ActionDetails logInfo={info._id} />
      </div>
    </article>
  );
}

export default CustomerDetailCard;