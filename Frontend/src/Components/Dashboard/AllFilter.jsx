import React from 'react'
import { useAuth } from '../../Context/AuthContext';

function AllFilter({ type, onFilterChange }) {
    const {statusFilter, setStatusFilter,user}=useAuth()

  // Define options based on which tab the employee is looking at
  const getOptions = () => {
    switch (type) {
      case 'connections':
        return [
          { label: 'All Status', value: 'all' },
          { label: 'Pending Only', value: 'Pending' },
          { label: 'Active Only', value: 'Active' },
          { label: 'Order Approved', value: 'Approved' },
          { label: 'Order Generation', value: 'Generation' },
          { label: 'Order In Process', value: 'Process' },
          { label: 'Termination Pending', value: "Notice Period" },
          { label: 'Chrun', value:"Disconnected" },
          { label: 'Airtel Provider', value: 'Airtel' }
        ];
      case 'users':
        return [
          { label: 'All Roles', value: 'all' },
          { label: 'Employees', value: 'employee' },
          { label: 'Admins', value: 'admin' },
          { label: 'Incomplete Profiles', value: 'incomplete' }
        ];
      case 'customers':
        return [
          { label: 'All Customers', value: 'all' },
          { label: 'Active', value: 'true' },
          { label: 'Inactive', value: 'false' }
        ];
      default:
        return [{ label: 'All', value: 'all' }];
    }
  };
  const handleChange=(e)=>{
    onFilterChange(e)
    setStatusFilter(e)

  }
return <select 
      id='filter'
      className=" rounded-md px-3 py-2 text-sm bg-[#ffffff00]  outline-none"
      onChange={(e) => handleChange(e.target.value)}
      value={statusFilter}
    >
      {getOptions().map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>

}

export default AllFilter;