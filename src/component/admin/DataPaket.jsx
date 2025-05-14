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
        <h1 className="text-lg font-semibold text-[#207f15]">Data Makanan</h1>
        <button
          onClick={handleTambahData}
          className="bg-[#207f15] text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + Tambah Data
        </button>
      </div>

      <div className="w-full max-w-full overflow-x-auto">
        <div className="sm:w-auto w-3">
          <table className="min-w-full text-sm text-gray-800 bg-white">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2 border whitespace-nowrap" rowSpan={2}>
                  No
                </th>
                <th className="px-4 py-2 border whitespace-nowrap" rowSpan={2}>
                  Nama Makanan
                </th>
                <th className="px-4 py-2 border text-center whitespace-nowrap" colSpan={2}>
                  Kecepatan
                </th>
                <th className="px-4 py-2 border whitespace-nowrap" rowSpan={2}>
                  Harga per Bulan
                </th>
                <th className="px-4 py-2 border whitespace-nowrap" rowSpan={2}>
                  Aksi
                </th>
              </tr>
              <tr>
                <th className="px-4 py-2 border whitespace-nowrap">Download</th>
                <th className="px-4 py-2 border whitespace-nowrap">Upload</th>
              </tr>
            </thead>
            <tbody>
              {paketList.map((paket, index) => (
                <tr key={paket.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border whitespace-nowrap">{index + 1}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{paket.nama}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{paket.download}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">{paket.upload}</td>
                  <td className="px-4 py-2 border whitespace-nowrap">
                    {formatRupiah(paket.harga)}
                  </td>
                  <td className="px-4 py-2 border whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(paket.id)}
                      className="text-red-500 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {paketList.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
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
