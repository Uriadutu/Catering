import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import AddPaketModal from "../modals/AddPaketModal";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../auth/Firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const DataPaket = () => {
  const [isOpenModalAdd, setIsOpenModalAdd] = useState(false);
  const [paketList, setPaketList] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "paket"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        no: index + 1,
        ...doc.data(),
      }));
      setPaketList(data);
    });

    return () => unsubscribe();
  }, []);

  const navigate = useNavigate();
  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  const handleTambahData = () => {
    setIsOpenModalAdd(true);
  };

  const handleDelete = async (id) => {
    const konfirmasi = window.confirm("Yakin ingin menghapus paket ini?");
    if (!konfirmasi) return;

    try {
      await deleteDoc(doc(db, "paket", id));
      toast.success("Paket berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus paket:", error);
      toast.error("Gagal menghapus paket.");
    }
  };

  return (
    <div className="p-4" translate="no">
      <ToastContainer position="top-right" autoClose={3000} />
      <AnimatePresence>
        {isOpenModalAdd && (
          <AddPaketModal setIsOpenModalAdd={setIsOpenModalAdd} />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-[#6b5dff]">Data Paket</h1>
        <button
          onClick={handleTambahData}
          className="bg-[#6b5dff] text-white px-4 py-2 rounded hover:bg-blue-700 transition whitespace-nowrap"
        >
          + Tambah Data
        </button>
      </div>

     <div className="w-full max-w-full overflow-x-auto">
        <div className="sm:w-auto w-3">
          <table className="min-w-full text-sm text-gray-800 bg-white">
              <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <tr>
                  <th className="px-4 py-3 border text-center">No</th>
                  <th className="px-4 py-3 border">Nama Makanan</th>
                  <th className="px-4 py-3 border text-right">Harga</th>
                  <th className="px-4 py-3 border text-center" colSpan={2}>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {paketList.map((paket, index) => (
                  <tr
                    key={paket.id}
                    className="hover:bg-gray-50 transition whitespace-nowrap duration-150"
                  >
                    <td className="px-4 py-3 border text-center">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 border">{paket.nama}</td>
                    <td className="px-4 py-3 border text-right">
                      {formatRupiah(paket.harga)}
                    </td>
                    <td className="px-2 py-3 border text-center">
                      <button onClick={() => navigate(`/menu/${paket.id}`)} className="flex items-center justify-center text-center gap-1 px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 transition whitespace-nowrap">
                        Lihat Menu
                      </button>
                    </td>
                    <td className="px-2 py-3 border text-center">
                      <button
                        onClick={() => handleDelete(paket.id)}
                        className="flex items-center justify-center gap-1 px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition whitespace-nowrap"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
                {paketList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      Belum ada Data Makanan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
};

export default DataPaket;
