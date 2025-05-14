import React, { useState } from "react";
import { db } from "../../auth/Firebase";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const AddMenuModal = ({ setIsOpenModalAdd }) => {
  const [namaMenu, setNamaMenu] = useState(""); // State untuk Nama Menu
  const {id} = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!namaMenu) {
      toast.error("Nama Menu tidak boleh kosong!");
      return;
    }

    try {
      // Menambahkan data menu ke Firebase
      await addDoc(collection(db, "menu"), {
        namaMenu,
        createdAt: new Date(),
        idPaket : id
      });

      toast.success("Menu berhasil ditambahkan.");
      setIsOpenModalAdd(false); // Menutup modal setelah berhasil
    } catch (error) {
      console.error("Gagal menambahkan menu:", error);
      toast.error("Gagal menambahkan menu.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-[100] flex justify-center items-center">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-xl font-semibold mb-4">Tambah Menu</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nama Menu</label>
            <input
              type="text"
              value={namaMenu}
              onChange={(e) => setNamaMenu(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Masukkan Nama Menu"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsOpenModalAdd(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-[#6b5dff] text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenuModal;
