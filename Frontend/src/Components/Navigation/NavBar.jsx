import { useAuth } from '../../Context/AuthContext';
import { NavLink } from 'react-router-dom';
import { HamburgerMenu } from '../Icons/Icons';
import Logout from '../Auth/Logout';

function NavBar() {
  const { user } = useAuth()

  const list = [
    { name: "Home", url: "/", visible: true },
    { name: "Dashboard", url: "/dashboard", visible: true },
    { name: "Add Customer", url: "/customers/add", visible: true },
    // { name: "Opportunity", url: "/connections", visible: true },
    // { name: "Employees", url: "/employees", visible: true },
  ]
  return (
    <nav className='w-full h-[10vh] items-center px-8 justify-between  flex select-none '>
      <section className='flex  gap-8'>
        {/* <div className="cursor-pointer flex justify-center items-center"><HamburgerMenu /></div> */}
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