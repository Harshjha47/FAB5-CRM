import React from 'react'
import { useDashboard } from '../../Context/DashboardContext'; // 🚀 Switch to our high-performance dashboard context
import { useMemo } from 'react';

function AllFilter({ type, onFilterChange }) {
  // Pull status filter management strings out of the dashboard context layer
  const { connStatusFilter, custFilter, userFilter } = useDashboard();



  // Define options based on which tab the employee is looking at
  const getOptions = () => {
    switch (type) {
      case 'connections':
        return [
          { label: 'All Status', value: 'All' }, // 🚀 Capitalized to match backend schema states cleanly
          { label: 'Pending Only', value: 'Pending' },
          { label: 'Active Only', value: 'Active' },
          { label: 'Order Approved', value: 'Approved' },
          { label: 'Implementation', value: 'Generation' },
          { label: 'Termination Pending', value: "Notice Period" },
          { label: 'Churn', value: "Disconnected" },
        ];
      case 'users':
        return [
          { label: 'All Roles', value: 'All' },
          { label: 'Employees', value: 'employee' },
          { label: 'Admins', value: 'admin' },
          { label: 'Incomplete Profiles', value: 'incomplete' }
        ];
      case 'customers':
        return [
          { label: 'All Customers', value: 'All' },
          { label: 'Active', value: 'true' },
          { label: 'Inactive', value: 'false' }
        ];
      default:
        return [{ label: 'All', value: 'All' }];
    }
  };

  const handleChange = (value) => {
    // Triggers the orchestrator fetch handler to run a page-1 database lookup
    onFilterChange(value);
  };

  // Determine which active filter context value to display on screen
  const currentSelectValue = useMemo(() => {
    if (type === 'connections') return connStatusFilter;
    if (type === 'customers') return custFilter;
    if (type === 'users') return userFilter;
    return 'All';
  }, [type, connStatusFilter, custFilter, userFilter]);

  return (
   <select 
      id='filter'
      className="rounded-md px-3 py-2 text-sm  bg-transparent outline-none cursor-pointer "
      onChange={(e) => onFilterChange(e.target.value)}
      value={currentSelectValue}
    >
      {getOptions().map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export default AllFilter;