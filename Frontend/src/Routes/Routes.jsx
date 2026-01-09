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
import Extend from "../Components/Dashboard/Extend";
import Retain from "../Components/Dashboard/Retain";
import Transfer from "../Components/Dashboard/Transfer";
import Auth from "../Pages/Auth";
import Login from "../Components/Auth/Login";
import Signup from "../Components/Auth/Signup";
import Profile from "../Components/Auth/Profile";
import OTP from "../Components/Auth/OTP";
import ResetPassword from "../Components/Auth/ResetPassword";
import ReDisconnection from "../Components/Dashboard/ReDisconnection";
import PrivateRoute from "./PrivateRoute";
import PublicRouter from "./PublicRouter";
import PageNotFound from "../Components/Utils/PageNotFound";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Home />}></Route>
      <Route element={<PrivateRoute />}>
        <Route path="/customer/:id" element={<Customer />}>
          <Route path="" element={<CustomerSumDetails />}></Route>
          <Route path="extend" element={<Extend />}></Route>
          <Route path="retain" element={<Retain />}></Route>
          <Route path="disconnect" element={<ReDisconnection />}></Route>
        </Route>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="" element={<CustomerList />}></Route>
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
    </Route>
  )
);
