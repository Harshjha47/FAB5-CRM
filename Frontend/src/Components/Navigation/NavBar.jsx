import { NavLink } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import Logout from '../Auth/Logout';
import { Connections, Customers, Team, Plus } from '../Icons/Icons';
import { useDashboard } from '../../Context/DashboardContext';

function NavBar({ counts = {}, blockedCount = 0 }) {
  const { user } = useAuth();
    const { connStatusFilter, custFilter, userFilter,activeTab,setActiveTab,metrics, loadingMetrics } = useDashboard();

  const role = user?.role;
  const isStaff = role === 'employee' || role === 'admin';

  const records = [
    { name: 'Connections', url: 'connections', Icon: Connections, tone: '#6c5ce7',font:"#07003a", count: counts?.totalOpportunities, visible: true },
    { name: 'Customers', url: 'customers', Icon: Customers, tone: '#3aa0e0',font:"#00243a", count: counts?.totalCustomers, visible: isStaff },
    { name: 'Team', url: 'users', Icon: Team, tone: '#2fb47c',font:"#00351f", count: counts?.users||"", visible: role === 'admin' },
  ].filter((e) => e.visible);

  const extensions = [
    { name: 'Bahi Khata', url: 'https://tool-bahi-khataa.vercel.app', img: './bahiKhata.webp', tint: '#fdeee0', external: true, visible: true },
    { name: 'Samadhan', url: 'https://samadhan.fab5connect.com', img: './samadhan.webp', tint: '#fff', external: true, visible: true },
    { name: 'Drishti', url: '/report', img: './dristi.webp', tint: '#fff', external: false, visible: isStaff || role === 'project_manager' },
  ].filter((e) => e.visible);

  return (
    <nav className="flex h-screen w-[76px] shrink-0 select-none flex-col items-center gap-2 bg-gradient-to-b from-[#fbf9fe] to-[#f3effc] py-5">
      <NavLink to="/dashboard" title="Dashboard" className="flex h-[46px] w-[46px] p-[2px] items-center justify-center overflow-hidden rounded-[9px] bg-[#fff] ">
        <img src="./fab5.svg" alt="connect" className="h-full w-full object-fit" />
      </NavLink>

      <ul className="mt-3.5 flex flex-col items-center gap-1.5">
        {records.map(({ name, url, Icon, tone, count }) => {
          const isActive = activeTab==url
          return (
          <li key={url} onClick={()=>setActiveTab(url)}  style={{color:(!isActive&&tone)}}
              className={
                `flex h-[46px] w-[46px] flex-col items-center justify-center gap-0.5 rounded-[15px] transition-all ${
                  isActive ? 'bg-[#1a1b21] text-white shadow-[0_12px_20px_-14px_rgba(26,27,33,0.9)]' : `hover:bg-[#f0ecfb]`
                }`
              }>
           
              {(
                <>
                  <Icon className="text-[18px]" style={!isActive ? { color: tone } : undefined} />
                  {count != null && (
                    <span className={`font-mono text-[9.5px] leading-none ${isActive ? 'text-white/60' : 'text-[#6e7285]'}`}>{count}</span>
                  )}
                </>
              )}
          </li>
        )})}
      </ul>

      <span className="my-3 h-px w-[26px] bg-[#e3ddf4]" />

      <ul className="flex flex-col items-center gap-2">
        {extensions.map(({ name, url, img, tint, external }) => {
          const inner = (
            <>
              {img ? (
                <img src={img} alt={name} className="h-full w-full rounded-[14px] object-fit " />
              ) : (
                <span className="text-[13px] font-bold text-[#6e7285]">{name.charAt(0)}</span>
              )}
              {external && <span className="absolute right-1.5 top-1 text-[7px] text-[#6e7285]/60">↗</span>}
            </>
          );
          const cls = 'relative flex h-[42px] w-[42px] items-center justify-center overflow-hidden rounded-[14px] transition-transform hover:-translate-y-px';
          return (
            <li key={name}>
              {external ? (
                <a href={url} target="_blank" rel="noreferrer" title={name} className={cls} style={{ background: tint }}>
                  {inner}
                </a>
              ) : (
                <NavLink to={url} title={name} className={cls} style={{ background: tint }}>
                  {inner}
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>

      {isStaff && (
        <NavLink
          to="/customers/add"
          title="Add customer"
          className="mt-auto flex h-[46px] w-[46px] items-center justify-center rounded-[15px] bg-[#6c5ce7] text-white shadow-[0_16px_26px_-18px_#6c5ce7] transition hover:brightness-110"
        >
          <Plus className="text-[17px]" />
        </NavLink>
      )}

      {isStaff && blockedCount > 0 && (
        <NavLink
          to="/connections?status=Approved&bandwidth=unassigned"
          title={`${blockedCount} approved orders blocked`}
          className="mt-2 flex h-[46px] w-[46px] flex-col items-center justify-center rounded-[15px] bg-gradient-to-b from-[#6c5ce7] to-[#4a3fb0] shadow-[0_16px_26px_-18px_#6c5ce7] transition hover:brightness-110"
        >
          <span className="font-mono text-[14px] font-semibold leading-none text-white">{blockedCount}</span>
          <span className="mt-0.5 text-[7px] font-semibold uppercase tracking-[0.6px] text-white/70">blocked</span>
        </NavLink>
      )}

      <span className={`${isStaff ? 'mt-3' : 'mt-auto'} mb-2.5 h-px w-[26px] bg-[#e3ddf4]`} />

      <Logout />
    </nav>
  );
}

export default NavBar;