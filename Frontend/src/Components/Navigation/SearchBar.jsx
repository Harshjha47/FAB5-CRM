import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { Link } from 'react-router-dom';
import {X} from 'lucide-react'


const SearchBar = () => {
  const {allData, setAllData}=useAuth()
  const [data,setData]=useState(allData)
  const [query, setQuery] = useState('');

  useEffect(()=>{setData(allData)},[allData])

  const filteredResults = useMemo(() => {
    if (!query.trim()) return { connections: [], customers: [], users: [] };
    
    const lowQuery = query.toLowerCase();

    return {
      connections: data?.connections?.filter(c => 
        c.customer?.name?.toLowerCase().includes(lowQuery) || 
        c.serviceType?.toLowerCase().includes(lowQuery)
      ),
      customers: data?.customers?.filter(c => 
        c.name?.toLowerCase().includes(lowQuery) || 
        c.email?.toLowerCase().includes(lowQuery)
      ),
      users: data?.users?.filter(u => 
        u.name?.toLowerCase().includes(lowQuery) || 
        u.role?.toLowerCase().includes(lowQuery)
      )
    };
  }, [query, data]);

  return (
    <div className="relative w-full mx-auto select-none">
      {/* Search Input */}
      <div className=" relative flex items-center">
      <input
        type="text"
        placeholder="Search opportunities, customers, or team..."
        className="w-full p-4 border rounded-lg shadow-sm outline-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="text-gray-600 absolute right-3 text-sm rounded-full p-1  cursor-pointer bg-[#fff] hover:bg-[#f7f7f7] duration-200" onClick={()=>{setQuery("")}}><X/></div>
      </div>

      {/* Results Dropdown */}
      {query && (
        <div className="absolute w-full mt-2 bg-white border rounded-lg shadow-xl max-h-[500px] overflow-y-auto z-50">
          
          {/* Section: Connections */}
          {filteredResults?.connections?.length > 0 && (
            <Section title="Opportunities" items={filteredResults?.connections} render={(item) => (
              <Link to={`/customer/${item?.customer?._id}/connection/${item?._id}/history`} className="flex justify-between ">
                <span>{item?.customer?.name} ({item?.serviceType})</span>
                <span className="text-xs bg-yellow-100 px-2 py-1 rounded">{item?.status}</span>
              </Link>
            )} />
          )}

          {/* Section: Customers */}
          {filteredResults?.customers?.length > 0 && (
            <Section title="Customers" items={filteredResults?.customers} render={(item) => (
              <Link to={`/customer/${item?._id}`}>
                <p className="font-medium">{item?.name}</p>
                <p className="text-xs text-gray-500">{item?.email}</p>
              </Link>
            )} />
          )}

          {/* Section: Users */}
          {filteredResults?.users?.length > 0 && (
            <Section title="Team Members" items={filteredResults?.users} render={(item) => (
              <Link to={`/employees/${item?._id}`} className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  {item?.name?.charAt(0)}
                </div>
                <span>{item?.name} <small className="text-gray-400">({item?.role})</small></span>
              </Link>
            )} />
          )}

          {/* No Results State */}
          {Object.values(filteredResults)?.every(arr => arr?.length === 0) && (
            <div className="p-4 text-center text-gray-500">No matches found for "{query}"</div>
          )}
        </div>
      )}
    </div>
  );
};

// Sub-component for clean rendering
const Section = ({ title, items, render }) => (
  <div className="p-2">
    <h3 className="text-xs font-bold uppercase text-gray-400 px-2 mb-1">{title}</h3>
    {items?.map((item) => (
      <div key={item?._id} className="p-2 hover:bg-blue-50 cursor-pointer rounded transition-colors text-sm">
        {render(item)}
      </div>
    ))}
    <hr className="my-2" />
  </div>
);

export default SearchBar;