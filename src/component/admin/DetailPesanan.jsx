import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../auth/Firebase";

const DetailPesanan = () => {
  const { id } = useParams();
  const [pesanan, setPesanan] = useState(null);

  useEffect(() => {
    const fetchPesanan = async () => {
      const q = query(
        collection(db, "pesanan"),
        where("__name__", "==", id)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setPesanan({ id: doc.id, ...doc.data() });
      } else {
        setPesanan(null);
      }
    };

    fetchPesanan();
  }, [id]);

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  const formatTanggal = (timestamp) => {
    if (!timestamp) return "-";
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "long",
    }).format(date);
  };

  if (pesanan === null) {
    return (
      <div className="p-6 text-center text-gray-500">
        Data pesanan tidak ditemukan atau belum diterima.
      </div>
    );
  }

  return (
    <div className="p-6">
    <div className="flex items-center justify-between mb-8 max-w-xl mx-auto">
  <h1 className="text-2xl font-bold text-[#4F46E5]">Detail Pesanan Diterima</h1>
  <button
    onClick={() => window.history.back()}
    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition"
  >
    Kembali
  </button>
</div>


      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-xl mx-auto border border-gray-200">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800">{pesanan.namaPaket}</h2>
          <p className="text-sm text-gray-500">{formatTanggal(pesanan.tanggal)}</p>
        </div>

        <div className="mb-4 text-sm text-gray-700 space-y-2">
          <p><span className="font-medium text-gray-600">Nama Lengkap:</span> {pesanan.namaLengkap}</p>
          <p><span className="font-medium text-gray-600">No WhatsApp:</span> {pesanan.noWa}</p>
          <p><span className="font-medium text-gray-600">Harga Paket:</span> {formatRupiah(pesanan.harga)}</p>
        </div>

        <div>
          <p className="font-medium text-gray-700 mb-1">Menu Pilihan:</p>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            {pesanan.selectedMenus?.map((menu, index) => (
              <li key={index}>{menu}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DetailPesanan;
