import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { useAuth } from '../Context/AuthContext'
import App from "../App";
import Home from "../Pages/Home";
import Dashboard from "../Pages/Dashboard";
import CustomerList from "../Components/Dashboard/CustomerList";
import Customer from "../Pages/Customer";
import CustomerSumDetails from "../Components/Dashboard/CustomerSumDetails";
import Auth from "../Pages/Auth";
import Login from "../Components/Auth/Login";
import Signup from "../Components/Auth/Signup";
import Profile from "../Components/Auth/Profile";
import OTP from "../Components/Auth/OTP";
import ResetPassword from "../Components/Auth/ResetPassword";
import PrivateRoute from "./PrivateRoute";
import PublicRouter from "./PublicRouter";
import PageNotFound from "../Components/Utils/PageNotFound";
import Team from "../Components/Dashboard/Team";
import AddCustomer from "../Pages/AddCustomer";
import CreateConnection from "../Components/Connection/CreateConnection";
import ManageOrder from "../Components/Connection/ManageOrder";
import HistoryCard from "../Components/Connection/HistoryCard";
import Overview from "../Components/Dashboard/Overview";
import Connections from "../Components/Connection/Connections";
import TeamMate from "../Components/Dashboard/TeamMate";
import { all } from "axios";
import EmployeeDashboard from "../Components/Dashboard/EmployeeDashboard";

const RoleRoute = ({ allowedRoles }) => {
  const { userRole } = useAuth()
  if (allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />
  }
  return <Outlet />
};

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />} />

      <Route element={<PrivateRoute />}>

        <Route path="/customer/:id" element={<Customer />}>
          <Route index element={<CustomerSumDetails />} />
          <Route path="create" element={<CreateConnection />} />
          <Route path="connection/:cid/manage" element={<ManageOrder />} />
          <Route path="connection/:cid/history" element={<HistoryCard />} />
        </Route>

        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Overview />} />
        </Route>

        <Route path="/customers" element={<Dashboard />}>
          {/* <Route index element={<CustomerList />} /> */}
          <Route path="add" element={<AddCustomer />} />
        </Route>

        {/* <Route path="/connections" element={<Dashboard />}>
          <Route index element={<Connections />} />
        </Route> */}

        <Route path="/profile" element={<Profile />} />

        <Route path="/employees" element={<Dashboard />}>
          {/* <Route path="" element={<EmployeeDashboard />} /> */}
          <Route path=":id" element={<TeamMate />} />
        </Route>

      </Route>
      
      <Route element={<PublicRouter />}>
        <Route path="/auth" element={<Auth />}>
          <Route path="login" element={<Login />} />
          <Route index element={<Signup />} />
          <Route path="verification" element={<OTP />} />
          <Route path="reset" element={<ResetPassword />} />
          {/* <Route path="verify-reset" element={<VerifyResetOtp />} /> */}
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Route>,
  ),
);
