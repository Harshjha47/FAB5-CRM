import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/Routes.jsx";
import { AuthProvider } from "./Context/AuthContext";
import { CustomerProvider } from "./Context/CustomerContext";
import { ConnectionProvider } from "./Context/ConnectionContext";
import { DashboardProvider } from "./Context/DashboardContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CustomerProvider>
      <ConnectionProvider>
        <DashboardProvider>
          <RouterProvider router={router} />
        </DashboardProvider>
      </ConnectionProvider>
    </CustomerProvider>
  </AuthProvider>
);
