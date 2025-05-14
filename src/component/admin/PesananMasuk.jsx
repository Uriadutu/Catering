import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../auth/Firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import html2canvas from "html2canvas"; // Library untuk mengkonversi ke gambar

const PesananMasuk = () => {
  const [pesananList, setPesananList] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "pesanan"), orderBy("tanggal", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((doc, index) => ({
          id: doc.id,
          no: index + 1,
          ...doc.data(),
        }))
        .filter((pesanan) => pesanan.status === "pending"); // Filter only "pending" status
      setPesananList(data);
    });

    return () => unsubscribe();
  }, []);

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  const handleTerimaPesanan = (pesanan) => {
    const cardElement = document.getElementById(`card-${pesanan.id}`);
    html2canvas(cardElement, { backgroundColor: null }).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL();
      link.download = `${pesanan.namaPaket}-Pesanan.png`;
      link.click();
    });

    // Update status to "diterima"
    const pesananRef = doc(db, "pesanan", pesanan.id);
    updateDoc(pesananRef, {
      status: "diterima",
    })
      .then(() => {
        toast.success("Pesanan diterima dan gambar berhasil diunduh.");
      })
      .catch((error) => {
        toast.error("Gagal memperbarui status pesanan.");
      });
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-2xl font-semibold text-[#6b5dff] mb-6">
        Pesanan Masuk
      </h1>

      {/* Display Pesanan as Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pesananList.map((pesanan) => (
          <div className="bg-white p-2 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
              style={{
                padding: "20px",
                background: "#fff",
                border: "1px solid #ddd",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              }}>
            <div
              key={pesanan.id}
              id={`card-${pesanan.id}`}
             className="bg-white p-4"
            >
              <h3 className="text-xl font-semibold text-center text-[#333]">
                {pesanan.namaPaket}
              </h3>

              {/* Nama Lengkap and No WA */}
              <div className="text-sm text-gray-700 mt-4">
                <p>
                  <strong>Nama Lengkap:</strong> {pesanan.namaLengkap}
                </p>
                <p>
                  <strong>No WhatsApp:</strong> {pesanan.noWa}
                </p>
              </div>

              {/* Harga Paket */}
              <div className="mt-4">
                <p>
                  <strong>Harga Paket:</strong> {formatRupiah(pesanan.harga)}
                </p>
              </div>

              {/* Selected Menus */}
              <div className="mt-4">
                <p>
                  <strong>Menu Pilihan:</strong>
                </p>
                <ul className="list-disc pl-5">
                  {pesanan.selectedMenus.map((menu, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {menu}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={() => handleTerimaPesanan(pesanan)}
                className="px-6 py-2 text-sm font-medium text-white bg-green-500 rounded-full hover:bg-green-600 transition"
              >
                Terima Pesanan
              </button>
            </div>
          </div>
        ))}
        {pesananList.length === 0 && (
          <div className="col-span-full text-center py-6 text-gray-500">
            Belum ada pesanan masuk.
          </div>
        )}
      </div>
    </div>
  );
};

export default PesananMasuk;
