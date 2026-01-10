import React, { useState } from "react";
import InputUnit from "../Utils/InputUnit";
import { useCustomer } from "../../Context/CustomerContext";
import { RxCross1 } from "react-icons/rx";

function Disconnect() {
  const init = {
    name: "",
    btsId: "",
    circuitId: "",
    bandwidth: "",
    reason: "",
  };
  const {disconnection,disconnectionTog,setDisconnectionTog}=useCustomer()
  const [details, setDetails] = useState(init);
  const { name, btsId, circuitId, bandwidth, reason } = details;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    disconnection(details)
    setDisconnectionTog(false)
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
    <div className=" fixed bottom-0 right-0 bg-[#11111141] h-screen w-full flex z-[99] justify-center items-center ">
        <div onClick={()=>setDisconnectionTog(!disconnectionTog)} className=" absolute right-3 top-3 text-lg bg-white border rounded-full p-4"><RxCross1/></div>
      <section className="p-3 md:w-[30%] bg-white rounded-3xl">
        <div className="text-2xl leading-[1] flex justify-center items-center p-3">
          Raise Disconnection
        </div>
        <form action="" onSubmit={handleSubmit} className="flex flex-col gap-2">
          <InputUnit
            type="text"
            placeholder="Enter Customer Name"
            name="name"
            label="Customer Name"
            change={handleChange}
            value={name}
          />
          <InputUnit
            type="text"
            placeholder="Enter Bandwidth"
            name="bandwidth"
            label="Bandwidth"
            change={handleChange}
            value={bandwidth}
          />
          <InputUnit
            type="text"
            placeholder="Enter BTS ID"
            name="btsId"
            label="BTS ID"
            change={handleChange}
            value={btsId}
          />
          <InputUnit
            type="text"
            placeholder="Enter Circuit Id"
            name="circuitId"
            label="Circuit Id"
            change={handleChange}
            value={circuitId}
          />
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
