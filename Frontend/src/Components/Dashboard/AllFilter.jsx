import { useMemo } from 'react';
import { useDashboard } from '../../Context/DashboardContext';

function AllFilter({ type, onFilterChange }) {
  const { connStatusFilter, custFilter, userFilter } = useDashboard();

  const options = useMemo(() => {
    switch (type) {
      case 'connections':
        return [
          { label: 'All', value: 'All' },
          { label: 'Pending', value: 'Pending' },
          { label: 'Approved', value: 'Approved' },
          { label: 'Implementation', value: 'Generation' },
          { label: 'Active', value: 'Active' },
          { label: 'Termination', value: 'Notice Period' },
          { label: 'Churned', value: 'Disconnected' },
        ];
      case 'users':
        return [
        ];
      case 'customers':
        return [
        ];
      default:
        return [{ label: 'All', value: 'All' }];
    }
  }, [type]);

  const current = useMemo(() => {
    if (type === 'connections') return connStatusFilter;
    if (type === 'customers') return custFilter;
    if (type === 'users') return userFilter;
    return 'All';
  }, [type, connStatusFilter, custFilter, userFilter]);

  return (
    <div role="tablist" aria-label={`${type} filter`} className="flex min-w-0 gap-1 justify-end flex-1 items-center overflow-x-auto ">
      {options.map(({ label, value }) => {
        const active = current === value;
        return (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onFilterChange(value)}
            className={`shrink-0 whitespace-nowrap rounded-[9px] px-3.5 py-[7px] text-[11px] font-semibold transition-all ${
              active
                ? 'bg-[#1a1b21] text-white'
                : 'bg-[#f0eefa] text-[#7a7f94] hover:bg-[#e8e4f7] hover:text-[#4d5162]'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default AllFilter;