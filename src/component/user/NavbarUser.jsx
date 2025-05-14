import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import nama from "../../img/nama.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-shadow duration-300 ${
        isScrolled ? "bg-white/70 backdrop-blur-md shadow-md" : "bg-white/70 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 md:px-12 py-4 flex flex-wrap justify-between items-center gap-4">
        <h1
          className="text-xl font-bold text-[#6b5dff] cursor-pointer"
          onClick={() => handleNavigate("/")}
          translate="no"
        >
         <img src={nama} className="w-24 sm:w-32" alt="" />
        </h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-[#6b5dff] text-white rounded font-semibold hover:bg-blue-500 transition"
          onClick={() => handleNavigate("/masuk")}
        >
          Masuk
        </motion.button>
      </div>
    </nav>
  );
};

export default Navbar;
