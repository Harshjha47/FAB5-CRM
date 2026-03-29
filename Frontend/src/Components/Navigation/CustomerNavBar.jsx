import React, { useState } from 'react';
import { SlArrowLeft } from "react-icons/sl";
import { Link, useParams } from 'react-router-dom';
import { useCustomer } from '../../Context/CustomerContext';
import { IoAdd } from "react-icons/io5";

function CustomerNavBar() {
  const [tog, setTog] = useState(false);
  const { customerInformation } = useCustomer();
  const status = customerInformation?.activityLog?.at(-1)?.action;
  const { id } = useParams();

  return (
    <nav className='w-full h-[10vh] flex items-center px-3 justify-between'>
      <Link to={"/dashboard"} className='h-[65%] flex gap-2 leading-[1] items-center'>
        <div className="h-full aspect-square border flex justify-center items-center rounded-full bg-white">
          <SlArrowLeft />
        </div>
        <div className="text-sm">Dashboard</div>
      </Link>

      {/* Dropdown Container */}
      <div className='relative h-[65%] flex items-center'>
        {/* Toggle Button */}
        <button 
          onClick={() => setTog(!tog)}
          className="border p-3 px-4 rounded-lg bg-[#fff] shadow-md flex gap-2 items-center cursor-pointer"
        >
          <IoAdd />Add New Connection
        </button>

        {/* Dropdown Menu */}
        {tog && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg flex flex-col z-50 overflow-hidden">
            <Link 
              to={`/customer/${id}/create/ip`} 
              onClick={() => setTog(false)}
              className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b transition-colors"
            >
              Add IP Order
            </Link>
            <Link 
              to={`/customer/${id}/create/ill`} 
              onClick={() => setTog(false)}
              className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b transition-colors"
            >
              Add ILL Order
            </Link>
            <Link 
              to={`/customer/${id}/create`} 
              onClick={() => setTog(false)}
              className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Add Service Order
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default CustomerNavBar;