import { BiSolidEdit } from "react-icons/bi";
import { Link, useParams } from "react-router-dom";

function CustomerCardSecond({ information }) {
    const { cid, id } = useParams();
  
  

  return (
    <>
      <article
        className="border border-[#99999910] bg-[#fff] shadow-md p-5 rounded-2xl flex flex-col gap-3"
      >
        <div className="w-full  p-2 flex flex-col items-start">
          <h3 className="font-semibold  w-full flex justify-between items-center">{information?.name}
          </h3>
          <p
            className={` text-xs py-[2px] flex gap-1  text-[#1d1d1d] rounded-md  opacity-80  justify-center items-center`}
          >
            {information?.person}
          </p>
        </div>
        <div className=" flex gap-2 flex-col items-start justify-between">
          <h4 className="text-xs border font-semibold text-zinc-400 px-2 p-[1px] rounded">
            {information?.email}
          </h4>
          <h4 className="text-xs border font-semibold text-zinc-400 px-2 p-[1px] rounded">
            {information?.mobile}
          </h4>
        </div>
      </article>
    </>
  );
}

export default CustomerCardSecond;
