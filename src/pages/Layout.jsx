import React from "react";
import Navbar from "../component/Navbar";
import Sidebar from "../component/Sidebar";

const Layout = ({ children }) => {
  return (
    <React.Fragment>
      {/* Decorative Background Blur */}
      <div className="absolute z-[-2] w-[300px] h-[200px] bg-blue-300 opacity-30 blur-3xl rounded-full top-5 left-5 md:w-[400px] md:h-[250px] md:left-32"></div>
      <div className="absolute z-[-2] w-[350px] h-[220px] bg-purple-300 opacity-30 blur-3xl rounded-full bottom-5 right-5 md:w-[500px] md:h-[300px] md:right-32"></div>

      {/* Layout wrapper */}
      <div className="min-h-screen flex flex-col bg-gray-100">

        {/* Navbar (Top) */}
        <header className="fixed top-0 left-0 right-0 z-20 bg-white">
          <Navbar />
        </header>

        {/* Content with Sidebar */}
        <div className="flex flex-1 pt-20 sm:pt-24 gap-3 mx-2 sm:mx-20">
          {/* Sidebar (Left) */}
          <aside className="hidden sm:block top-16 left-0 h-full w-64  z-10">
            <Sidebar />
          </aside>

          {/* Main Content (Right of Sidebar) */}
          <main className="flex-1 bg-white border border-gray-200 p-4">
            {children}
          </main>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Layout;
