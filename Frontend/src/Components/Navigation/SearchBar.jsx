import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { Link } from 'react-router-dom';
import { X, Search } from 'lucide-react'; // Added Search icon for professional UI
import dashboardService from '../../Services/dashboard.service';

const SearchBar = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ connections: [], customers: [], users: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. If the input is wiped out, instantly empty results array buffers
    if (!query.trim()) {
      setResults({ connections: [], customers: [], users: [] });
      return;
    }

    // 2. Setup the 300ms debouncer timer window
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await dashboardService.search(query);
        if (response.success) {
          setResults(response.results);
        }
      } catch (err) {
        console.error("Global dashboard search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    // Clean up timer if the user types another character within 300ms
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="relative w-full mx-auto select-none">
      {/* Search Input Container */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search opportunities, customers, or team..."
          className="w-full pl-12 pr-10 p-4 border rounded-lg shadow-sm outline-none bg-white focus:border-indigo-500 transition-colors"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <div 
            className="text-gray-400 absolute right-3 rounded-full p-1 cursor-pointer hover:bg-gray-100 transition-colors" 
            onClick={() => setQuery("")}
          >
            <X className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Results Dropdown Box overlay overlay */}
      {query.trim() && (
        <div className="absolute w-full mt-2 bg-white border rounded-lg shadow-xl max-h-[500px] overflow-y-auto z-50 border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center p-6 gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
              <span className="text-sm text-gray-400">Searching system database...</span>
            </div>
          ) : (
            <>
              {/* Opportunities Grid Output */}
              {results.connections?.length > 0 && (
                <Section title="Opportunities" items={results.connections} render={(item) => (
                  <Link to={`/customer/${item?.customer?._id}/connection/${item?._id}/history`} className="flex justify-between w-full">
                    <span className="font-medium text-gray-700">{item?.customer?.name || "Unknown"} ({item?.serviceType})</span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full flex items-center font-semibold">{item?.status}</span>
                  </Link>
                )} />
              )}

              {/* Customers Grid Output */}
              {(user?.role === "employee" || user?.role === "admin") && results.customers?.length > 0 && (
                <Section title="Customers" items={results.customers} render={(item) => (
                  <Link to={`/customer/${item?._id}`} className="block w-full">
                    <p className="font-medium text-gray-700">{item?.name}</p>
                    <p className="text-xs text-gray-400">{item?.email}</p>
                  </Link>
                )} />
              )}

              {/* Team Directory Grid Output */}
              {user?.role === "admin" && results.users?.length > 0 && (
                <Section title="Team Members" items={results.users} render={(item) => (
                  <Link to={`/employees/${item?._id}`} className="flex items-center gap-2 w-full">
                    <div className="w-6 h-6 bg-indigo-600 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                      {item?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-700 font-medium">{item?.name} <small className="text-gray-400 font-normal">({item?.role})</small></span>
                  </Link>
                )} />
              )}

              {/* Explicit Empty Matches Box */}
              {results.connections?.length === 0 && results.customers?.length === 0 && results.users?.length === 0 && (
                <div className="p-6 text-center text-gray-400 text-sm">No matches found for "{query}"</div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

const Section = ({ title, items, render }) => (
  <div className="p-2">
    <h3 className="text-xs font-bold uppercase text-gray-400 px-2 pt-2 mb-1 tracking-wider">{title}</h3>
    {items?.map((item) => (
      <div key={item?._id} className="p-2 hover:bg-indigo-50/60 cursor-pointer rounded transition-colors text-sm flex w-full">
        {render(item)}
      </div>
    ))}
    <hr className="my-1.5 border-gray-100" />
  </div>
);

export default SearchBar;