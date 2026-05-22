import { useAuth } from '../../Context/AuthContext';
import { NavLink } from 'react-router-dom';
import Logout from '../Auth/Logout';

function NavBar() {
  const { user } = useAuth()

  const list = [
    { name: "Home", url: "/", visible: true },
    { name: "Dashboard", url: "/dashboard", visible: true },
    { name: "Bahi Khata", url: "https://tool-bahi-khataa.vercel.app", visible: true },
    { name: "Samadhan", url: "https://tool-samadhan.vercel.app", visible: true },
    (user?.role === "employee"||user?.role === "admin")&&{ name: "Add Customer", url: "/customers/add", visible: true },
  ]
  return (
    <nav className='w-full h-[10vh] items-center px-8 justify-between  flex select-none '>
      <section className='flex  gap-8'>
        <ul className=' md:flex  gap-8 hidden'>
          {list?.map((e, i) => {
            return (
              <li key={i}><NavLink to={e.url}>{e.name}</NavLink></li>
            )
          })}
        </ul>
      </section>
      <section className='flex gap-2'>Hello, {user?.name || "User"} <Logout/></section>
    </nav>
  )
}

export default NavBar
