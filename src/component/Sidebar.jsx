import React from "react";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../auth/Firebase";
import {
  FiDollarSign,
  FiLogOut,
  FiShoppingCart,
} from "react-icons/fi";
import { IoFastFoodOutline } from "react-icons/io5";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <div className="hidden sm:flex flex-col z-40 bg-white w-64 px-6 py-8 text-gray-800 border border-gray-200">
      {/* Menu Section */}
      <nav className="flex flex-col gap-4">
        <SidebarItem to="/paket" icon={<IoFastFoodOutline />} label="Data Makanan" />
        <SidebarItem to="/pemesanan" icon={<FiShoppingCart />} label="Pemesanan Masuk" />
        <SidebarItem to="/pendapatan" icon={<FiDollarSign />} label="Pendapatan"/>
        <SidebarButton onClick={logout} icon={<FiLogOut />} label="Keluar" />
      </nav>
    </div>
  );
};

const SidebarItem = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-all"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const SidebarButton = ({ onClick, icon, label }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition-all text-left w-full"
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default Sidebar;
