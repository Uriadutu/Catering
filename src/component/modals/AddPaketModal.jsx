import React, { useState } from "react";
import { db } from "../../auth/Firebase";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const AddPaketModal = ({ setIsOpenModalAdd }) => {
  const [namaPaket, setNamaPaket] = useState("");
  const [harga, setHarga] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTambahPaket = async (e) => {
    e.preventDefault();

    if (!namaPaket.trim() || !harga.trim()) {
      alert("Nama Paket dan Harga wajib diisi.");
      return;
    }

    const hargaNumber = Number(harga);
    if (isNaN(hargaNumber) || hargaNumber < 0) {
      alert("Harga harus berupa angka yang valid.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Pengguna belum login.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "paket"), {
        nama: namaPaket,
        harga: hargaNumber,
        createdAt: new Date(),
        uid: user.uid,
      });
      toast.success("Paket berhasil ditambahkan!");
      setNamaPaket("");
      setHarga("");
      setIsOpenModalAdd(false);
    } catch (error) {
      console.error("Gagal menambah paket:", error);
      toast.error("Gagal menambah paket.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 px-2 flex items-center sm:items-start sm:pt-3 justify-center bg-black z-40 bg-opacity-60">
      <form onSubmit={handleTambahPaket}>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg bg-white rounded-lg shadow-lg"
        >
          <div className="flex items-start justify-between p-4 border-b border-gray-200 rounded-t">
            <h3 className="text-xl font-semibold text-gray-700">Tambah Paket</h3>
            <button
              onClick={() => setIsOpenModalAdd(false)}
              type="button"
              className="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-700 bg-transparent rounded-lg hover:bg-red-500 hover:text-white transition duration-300"
            >
              ✕
            </button>
          </div>
          <div className="p-4 space-y-4 text-gray-700">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <label className="text-sm font-medium">Nama Paket</label>
                <input
                  type="text"
                  value={namaPaket}
                  onChange={(e) => setNamaPaket(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Masukan Nama Paket"
                />
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <label className="text-sm font-medium">Harga Paket (Rp)</label>
                <input
                  type="number"
                  value={harga}
                  onChange={(e) => setHarga(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Contoh: 150000"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end p-4 space-x-3 border-t border-gray-200 rounded-b">
            <button
              type="button"
              onClick={() => setIsOpenModalAdd(false)}
              className="px-4 py-2 bg-gray-200 border border-gray-400 text-gray-500 text-sm rounded hover:bg-gray-100 transition duration-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#00D020] px-3 py-2 text-white font-semibold text-sm rounded hover:bg-[#3bdf54] transition duration-300"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </motion.div>
      </form>
    </div>
  );
};

export default AddPaketModal;
