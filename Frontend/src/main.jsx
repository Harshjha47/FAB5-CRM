import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/Routes.jsx";
import { AuthProvider } from "./Context/AuthContext";
import { CustomerProvider } from "./Context/CustomerContext";
import { ConnectionProvider } from "./Context/ConnectionContext";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CustomerProvider>
      <ConnectionProvider>
        <RouterProvider router={router} />
      </ConnectionProvider>
    </CustomerProvider>
  </AuthProvider>
);
