import React, { useState } from "react";
import {InputUnit} from "../Utils/InputUnit";
import { useCustomer } from "../../Context/CustomerContext";
import { RxCross1 } from "react-icons/rx";
import { useParams } from "react-router-dom";

function Disconnect() {
  const init = {
    reason: "",
  };
  const {disconnection,disconnectionTog,setDisconnectionTog}=useCustomer()
  const [details, setDetails] = useState(init);
  const { reason } = details;
  const {cid}=useParams()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    disconnection(cid,details)
  };

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getLastString = () => {
    const today = new Date();
    today.setDate(today.getDate() + 30);
    return today.toISOString().split("T")[0];
  };
  return (
    <div className="  flex-1 flex mt-[10vh] justify-center items-center ">
      <section className="p-3 md:w-[30%] bg-white rounded-3xl">
        <div className="text-2xl leading-[1] flex justify-center items-center p-3">
          Raise Disconnection
        </div>
        <form action="" onSubmit={handleSubmit} className="flex flex-col gap-2">
          
          <InputUnit
            type="date"
            name="date"
            label="Raise Date"
            prop={true}
            value={getTodayString()}
          />
          <InputUnit
            type="date"
            name="newDate"
            label="Last Date"
            prop={true}
            value={getLastString()}
          />
          <div className="">
            <label htmlFor="reason" className="pl-1 text-sm">
              Reason for disconnection
            </label>
            <textarea
              name="reason"
              required
              id="reason"
              placeholder="Reason"
              value={reason}
              onChange={handleChange}
              className=" resize-none w-full border px-2 customScroller rounded-md outline-none"
            ></textarea>
          </div>
          <div className="py-3 ">
            <button
              type="submit"
              className="p-[10px] text-white w-full bg-[#111] rounded-md "
            >
              Submit
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Disconnect;
