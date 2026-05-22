import { Toaster } from 'react-hot-toast'
import { Outlet } from 'react-router-dom'
import GlobalBackButton from './Components/Utils/GlobalBackButton'

function App() {
  return (
    <>
      <Toaster />
      <GlobalBackButton />
      <Outlet />
    </>
  )
}

export default App