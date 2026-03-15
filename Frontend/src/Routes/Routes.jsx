import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
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

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />}></Route>
      <Route element={<PrivateRoute />}>
        <Route path="/customer/:id" element={<Customer />}>
          <Route path="" element={<CustomerSumDetails />}></Route>
          <Route path="create" element={<CreateConnection />}></Route>
          <Route
            path="connection/:cid/manage"
            element={<ManageOrder />}
          ></Route>
          <Route
            path="connection/:cid/history"
            element={<HistoryCard />}
          ></Route>
        </Route>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="" element={<Overview />}></Route>
        </Route>
        <Route path="/customers" element={<Dashboard />}>
          <Route path="" element={<CustomerList />}></Route>
          <Route path="add" element={<AddCustomer />}></Route>
        </Route>

        <Route path="/employees" element={<Dashboard />}>
          <Route path="" element={<Team />}></Route>
          <Route path=":id" element={<TeamMate />}></Route>
        </Route>
        <Route path="/connections" element={<Dashboard />}>
          <Route path="" element={<Connections />}></Route>
        </Route>

        <Route path="/profile" element={<Profile />}></Route>
      </Route>
      <Route element={<PublicRouter />}>
        <Route path="/auth" element={<Auth />}>
          <Route path="login" element={<Login />}></Route>
          <Route path="" element={<Signup />}></Route>
          <Route path="varification" element={<OTP />}></Route>
          <Route path="reset" element={<ResetPassword />}></Route>
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />}></Route>
    </Route>,
  ),
);
