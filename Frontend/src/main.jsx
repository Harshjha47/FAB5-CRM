import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/Routes.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { CustomerProvider } from "./Context/CustomerContext.jsx";
import { ConnectionProvider } from "./Context/ConnectionContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CustomerProvider>
      <ConnectionProvider>
      <RouterProvider router={router} />
      </ConnectionProvider>
    </CustomerProvider>
  </AuthProvider>
);
