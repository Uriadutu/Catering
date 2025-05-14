import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../auth/Firebase";

const PesanPaketModal = ({ setIsOpenModalAdd, paket, menus }) => {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [noWa, setNoWa] = useState("");
  const [selectedMenus, setSelectedMenus] = useState([]);

  const handleCheckboxChange = (menuId) => {
    setSelectedMenus((prevSelectedMenus) => {
      if (prevSelectedMenus.includes(menuId)) {
        // Jika sudah tercentang, hapus dari selectedMenus
        return prevSelectedMenus.filter((id) => id !== menuId);
      } else {
        // Jika belum tercentang, tambahkan ke selectedMenus
        return [...prevSelectedMenus, menuId];
      }
    });
  };

  const handleSubmit = async () => {
    if (!namaLengkap || !noWa || selectedMenus.length === 0) {
      alert("Harap lengkapi semua field!");
      return;
    }

    try {
      await addDoc(collection(db, "pesanan"), {
        namaLengkap,
        noWa,
        paket: paket.id,
        namaPaket : paket.nama,
        selectedMenus,
        harga: paket.harga,
        tanggal: new Date(),
        status: "pending",
      });

      alert("Pesanan berhasil disimpan!");
      setIsOpenModalAdd(false);
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Gagal menyimpan pesanan.");
    }
  };

  console.log("MENUS:", menus);

  return (
    <div className="fixed inset-0 px-2 flex items-center sm:items-start sm:pt-3 justify-center bg-black z-[100] bg-opacity-60">
      {" "}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-0 sm:w-[400px] max-h-[90vh] overflow-y-auto p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        <span className="text-orange-600">{paket.nama}</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={namaLengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              No WhatsApp
            </label>
            <input
              type="text"
              value={noWa}
              onChange={(e) => setNoWa(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Menu:
            </p>
            <div className="max-h-40 overflow-y-auto pr-1 space-y-2">
              {menus.map((menu) => (
                <label
                  key={menu.namaMenu}
                  className="flex items-center space-x-2 text-sm text-gray-600"
                >
                  <input
                    type="checkbox"
                    checked={selectedMenus.includes(menu.namaMenu)}
                    onChange={() => handleCheckboxChange(menu.namaMenu)}
                    className="form-checkbox text-orange-500"
                  />
                  <span>{menu.namaMenu}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={() => setIsOpenModalAdd(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Simpan Pesanan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PesanPaketModal;
