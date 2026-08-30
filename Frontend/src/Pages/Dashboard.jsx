import { useAuth } from '../Context/AuthContext';
import NavBar from '../Components/Navigation/NavBar';
import Overview from '../Components/Dashboard/Overview';
import { Outlet } from 'react-router-dom';
import { useDashboard } from '../Context/DashboardContext';


function Dashboard() {
      const { metrics } = useDashboard();
  
  
  return (
    <main className='h-screen bg-gray-50 flex w-full   '>
      <NavBar counts={metrics?.performance}/>
      <Outlet/>
      

    </main>
  )
}

export default Dashboard