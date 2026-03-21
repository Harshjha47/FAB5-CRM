import { useAuth } from '../Context/AuthContext';
import NavBar from '../Components/Navigation/NavBar';
import Overview from '../Components/Dashboard/Overview';
import { Outlet } from 'react-router-dom';


function Dashboard() {
  const {profileData,LogoutUser}=useAuth()
  
  return (
    <main className='h-screen bg-gray-50 flex w-full flex-col  '>
      <NavBar/>
      <Outlet/>
      

    </main>
  )
}

export default Dashboard