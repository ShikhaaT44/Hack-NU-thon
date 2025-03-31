import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="pt-16">
        <main className="px-8 py-6 max-w-[1600px] mx-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
