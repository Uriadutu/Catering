import React, { useEffect, useState } from "react";
import { HiArrowCircleDown, HiArrowCircleUp } from "react-icons/hi";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../auth/Firebase";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import LihatPesananModal from "../modals/LihatPesananModal";

const DaftarPaket = () => {
  const [packages, setPackages] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openModalInfo, setOpenModalInfo] = useState(false);
  const [item, setItem] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "paket"), (snapshot) => {
      const paketData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPackages(paketData);
    });

    return () => unsubscribe();
  }, []);

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  const navigate = useNavigate();

  const handleLihatPesanan = (item) => {
    setOpenModalInfo(true);
    setItem(item);
  };

  return (
    <div className=" px-4 pt-2 sm:px-6 md:px-12 lg:px-20 mx-auto">
      <AnimatePresence>
        {openModalInfo && (
          <LihatPesananModal setIsOpenModalAdd={setOpenModalInfo} item={item} />
        )}
      </AnimatePresence>
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-shadow duration-300 ${
          isScrolled
            ? "bg-white/70 backdrop-blur-md shadow-md"
            : "bg-white/70 backdrop-blur-md"
        }`}
      >
        <div className="container mx-auto px-4 md:px-12 py-6 flex justify-between items-center">
          <h1
            className="text-xl font-bold text-[#6b5dff] cursor-pointer"
            onClick={() => handleNavigate("/")}
            translate="no"
          >
            Catering
          </h1>

          <ul className="hidden md:flex space-x-6 text-gray-700 font-medium">
            <li
              className="cursor-pointer hover:text-[#6b5dff] duration-300"
              onClick={() => handleNavigate("/")}
            >
              Beranda
            </li>
          </ul>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:block px-6 py-2 bg-[#6b5dff] text-white rounded font-semibold hover:bg-[#6b5dff] transition"
            onClick={() => handleNavigate("/masuk")}
          >
            Masuk
          </motion.button>

          <div className="md:hidden">
            <button onClick={toggleMenu}>
              {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-sm px-6 pt-4 pb-6 shadow-md">
            <ul className="space-y-4 text-gray-700 font-medium">
              <li
                className="cursor-pointer"
                onClick={() => handleNavigate("/")}
              >
                Beranda
              </li>
              <li>
                <button
                  className="w-full bg-[#6b5dff] text-white py-2 rounded font-semibold hover:bg-[#6b5dff] transition"
                  onClick={() => handleNavigate("/masuk")}
                >
                  Masuk
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
      <h2 className="text-2xl mt-20 sm:text-4xl text-center font-bold text-gray-900 leading-tight tracking-tight mb-5">
        Pilih Paket WiFi Terbaik Anda
      </h2>
      <p className="text-center text-gray-600 mb-10">
        Jelajahi berbagai pilihan paket wifi dengan kecepatan stabil dan harga
        terjangkau sesuai kebutuhan Anda.
      </p>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-5">
        {packages.length > 0 ? (
          packages.slice(0, 8).map((pkg) => (
            <div
              key={pkg.id}
              className="flex flex-col p-6 bg-[#6b5dff]/5 rounded-md border border-[#6b5dff] transition duration-300 transform hover:scale-[1.01]"
            >
              <h3 className="text-lg text-center font-medium text-gray-700 mb-4">
                {pkg.nama}
              </h3>

              <div className="mb-3 space-y-1 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <HiArrowCircleDown className="text-[#6b5dff]" />{" "}
                  {pkg.download} Download
                </p>
                <p className="flex items-center gap-2">
                  <HiArrowCircleUp className="text-[#6b5dff]" /> {pkg.upload}{" "}
                  Upload
                </p>
              </div>

              <p className="text-2xl font-semibold text-gray-700 my-6 text-center">
                {formatRupiah(pkg.harga)} / Bulan
              </p>

              <button
                onClick={() => handleLihatPesanan(pkg)}
                className="mt-auto w-full py-2 bg-white text-[#6b5dff] border border-[#6b5dff] rounded-md text-sm font-medium hover:bg-[#6b5dff]/10 transition duration-300"
              >
                Pilih Paket
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            Belum ada paket tersedia.
          </p>
        )}
      </div>
    </div>
  );
};

export default DaftarPaket;
