import { Outlet } from "react-router-dom";

function Auth() {
  return (
    <main className="h-screen w-full flex justify-center items-center bg-[#EBEDEC]">
      <Outlet />
    </main>
  );
}

export default Auth;
