import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import AddMenuModal from "../modals/AddMenuModal";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../auth/Firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

const DataMenu = () => {
  const [isOpenModalAdd, setIsOpenModalAdd] = useState(false);
  const [menuList, setMenuList] = useState([]);
  const { id } = useParams(); // Mendapatkan id dari URL

  useEffect(() => {
    // Membuat query untuk mengambil data berdasarkan idPaket yang sesuai dengan id dari URL
    const q = query(
      collection(db, "menu"),
      where("idPaket", "==", id), // Memfilter berdasarkan idPaket
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        no: index + 1,
        ...doc.data(),
      }));
      setMenuList(data);
    });


    return () => unsubscribe();
  }, [id]); // Efek ini akan dijalankan ketika id berubah

  const navigate = useNavigate();
  const handleTambahData = () => {
    setIsOpenModalAdd(true);
  };

  

  const handleDelete = async (id) => {
    const konfirmasi = window.confirm("Yakin ingin menghapus menu ini?");
    if (!konfirmasi) return;

    try {
      await deleteDoc(doc(db, "menu", id));
      toast.success("Menu berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus menu:", error);
      toast.error("Gagal menghapus menu.");
    }
  };

  return (
    <div className="p-4" translate="no">
      <ToastContainer position="top-right" autoClose={3000} />
      <AnimatePresence>
        {isOpenModalAdd && (
          <AddMenuModal setIsOpenModalAdd={setIsOpenModalAdd} />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-[#6b5dff]">Data Menu</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400 transition whitespace-nowrap"
          >
            Kembali
          </button>
          <button
            onClick={handleTambahData}
            className="bg-[#6b5dff] text-white px-4 py-2 rounded hover:bg-blue-700 transition whitespace-nowrap"
          >
            + Tambah Data
          </button>
        </div>
      </div>

      <div className="w-full max-w-full overflow-x-auto">
        <div className="sm:w-auto w-3">
          <table className="min-w-full text-sm text-gray-800 bg-white">
            <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <tr>
                <th className="px-4 py-3 border text-center">No</th>
                <th className="px-4 py-3 border">Nama Menu</th>
                <th className="px-4 py-3 border text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {menuList.map((menu, index) => (
                <tr
                  key={menu.id}
                  className="hover:bg-gray-50 transition whitespace-nowrap duration-150"
                >
                  <td className="px-4 py-3 border text-center">{index + 1}</td>
                  <td className="px-4 py-3 border">{menu.namaMenu}</td>
                  <td className="px-2 py-3 border text-center">
                    <button
                      onClick={() => handleDelete(menu.id)}
                      className="flex items-center justify-center gap-1 px-3 py-1 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 transition whitespace-nowrap"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {menuList.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    Belum ada Data Menu.
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

export default DataMenu;
