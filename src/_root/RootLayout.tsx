import React from "react";
import Bottombar from "../components/shared/Bottombar";
import Topbar from "@/components/shared/Topbar";
import Lftsidebar from "@/components/shared/Lftsidebar";
import { Outlet } from "react-router-dom";
const RootLayout = () => {
  return (
    <div className="w-full md:flex">
      <Topbar />
      <Lftsidebar />

      <section className="flex flex-1 h-full">
        <Outlet />
      </section>
      <Bottombar />
    </div>
  );
};

export default RootLayout;
