import React from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const LihatPesananModal = ({ setIsOpenModalAdd, item }) => {
  const whatsappNumber = "081347619487";
  const message = `Halo, saya tertarik dengan paket ${item?.nama}. Apakah masih tersedia?`;

  const handleWhatsApp = () => {
    const url = `https://wa.me/62${whatsappNumber.slice(
      1
    )}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className="fixed inset-0 px-4 flex items-center justify-center bg-black bg-opacity-40 z-50"
      onClick={() => setIsOpenModalAdd(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-xl shadow-xl p-6"
      >
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">Detail Paket</h2>
          <button
            onClick={() => setIsOpenModalAdd(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4 space-y-4 text-gray-700">
          <div>
            <label className="text-sm font-medium text-gray-500">
              Nama Makanan
            </label>
            <p className="text-lg font-semibold">{item?.nama}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Download
              </label>
              <p className="text-base">{item?.download}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Upload
              </label>
              <p className="text-base">{item?.upload}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Harga per Bulan
            </label>
            <p className="text-xl font-bold text-green-600">
              Rp. {Number(item?.harga).toLocaleString("id-ID")}
            </p>
          </div>

          <div className="pt-4 border-t mt-4 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Hubungi via WhatsApp untuk memesan:
            </p>
            <div className="w-full flex justify-center">
              <button
                onClick={handleWhatsApp}
                className="bg-green-500 text-center flex items-center gap-3 hover:bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded-full"
              >
                <FaWhatsapp />
                <p>Chat WhatsApp</p>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LihatPesananModal;
