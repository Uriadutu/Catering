import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PaketKami from "./PaketKami";

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div
        id="home"
        className="min-h-[40vh] flex flex-col items-center justify-center bg-white px-4 py-12 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          translate="no"
        >
        <PaketKami />
        </motion.h1>
      </div>
    </div>
  );
};

export default Splash;
