import { useAuth } from '../Context/AuthContext';
import NavBar from '../Components/Navigation/NavBar';
import Overview from '../Components/Dashboard/Overview';


function Dashboard() {
  const {profileData,LogoutUser}=useAuth()
  
  return (
    <main className='h-screen flex w-full flex-col bg-zinc-100 '>
      <NavBar/>
      <Overview/>
      

    </main>
  )
}

export default Dashboard