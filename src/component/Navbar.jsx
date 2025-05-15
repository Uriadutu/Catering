import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoIosClose } from "react-icons/io";
import {
  FiLogOut,
  FiUser,
  FiShoppingCart,
  FiDollarSign,
} from "react-icons/fi";
import { IoFastFoodOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../auth/Firebase";

const Navbar = () => {
  const [openSidebar, setOpenSideBar] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <div>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300 ${
          openSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpenSideBar(false)}
      />

      <div
        className={`fixed top-0 left-0 z-50 bg-white w-64 h-screen text-gray-800 shadow-lg transform transition-transform duration-300 sm:hidden ${
          openSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#6b5dff] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                <FiUser />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#6b5dff]">
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button onClick={() => setOpenSideBar(false)}>
              <IoIosClose size={28} />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex flex-col gap-3 mt-4">
            <SidebarItem to="/paket" icon={<IoFastFoodOutline />} label="Data Makanan" onClick={() => setOpenSideBar(false)} />
            <SidebarItem to="/pemesanan" icon={<FiShoppingCart />} label="Pemesanan Masuk" onClick={() => setOpenSideBar(false)} />
            <SidebarItem to="/pendapatan" icon={<FiDollarSign />} label="Pendapatan" onClick={() => setOpenSideBar(false)} />
            <SidebarButton onClick={() => { logout(); setOpenSideBar(false); }} icon={<FiLogOut />} label="Keluar" />
          </nav>
        </div>
      </div>

      {/* Top Navbar */}
      <div className="fixed top-0 left-0 w-full z-30 bg-white border-b border-gray-200 py-6 px-4 sm:px-6 flex justify-between items-center">
       
         <h1 className="text-xl font-bold text-[#6b5dff]">Catering</h1>
        <button onClick={() => setOpenSideBar(true)} className="sm:hidden">
          <GiHamburgerMenu color="#333" size={22} />
        </button>

        {/* Desktop: User Info */}
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-700">
          <FiUser />
          <span>{user?.email || "User"}</span>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ to, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 text-sm px-3 py-2 rounded-md hover:bg-gray-100 transition"
  >
    {icon}
    {label}
  </Link>
);

const SidebarButton = ({ onClick, icon, label }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 text-sm px-3 py-2 rounded-md hover:bg-gray-100 transition text-left w-full"
  >
    {icon}
    {label}
  </button>
);

export default Navbar;
