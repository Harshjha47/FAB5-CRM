import React from "react"; // Removed useState, we don't need it anymore!
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdMoreTime } from "react-icons/md";
import { InputUnit } from "../Utils/InputUnit";
import { useCustomer } from "../../Context/CustomerContext";

function Extend({ info }) {
  const { id, cid } = useParams();
  const navigate = useNavigate();
  const { extension, getCustomerById } = useCustomer();

  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + 30);
  const fixedDate = futureDate.toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    extension(cid, { newDate: fixedDate });
    navigate(`/customer/${id}`);
    getCustomerById(id);
  };

  return (
    <section className="h-full mt-[10vh] w-full flex justify-center relative items-center">
      <div className="rounded-lg md:w-[40%] border shadow-[#b1b1ff9a] shadow-xl border-[#88888818] p-4 flex flex-col gap-3 items-start">
        <h3 className="p-3 rounded-lg text-2xl text-blue-600 bg-[#c8c8ff38]">
          <MdMoreTime />
        </h3>
        <div className="w-full">
          <h4 className="font-semibold">Extend duration by 30 days?</h4>
          
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-3 mt-2"
          >
            <InputUnit
              type="date"
              name="newDate"
              label="New disconnection date (Fixed)"
              value={fixedDate}
              readOnly={true} 
            />

            <div className="w-full flex gap-2 justify-end py-3">
              <Link
                to={`/customer/${id}`}
                className="px-5 rounded-md p-1 border border-zinc-400"
              >
                Cancel
              </Link>
              <button type="submit" className="px-5 rounded-md p-1 border bg-blue-600 text-white border-blue-400 hover:bg-blue-800">
                Confirm Extension
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Extend;