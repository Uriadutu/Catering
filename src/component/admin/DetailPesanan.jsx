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

  if (pesanan === null) {
    return (
      <div className="p-6 text-center text-gray-500">
        Data pesanan tidak ditemukan atau belum diterima.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-[#6b5dff] mb-6">
        Detail Pesanan Diterima
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-center">{pesanan.namaPaket}</h2>

        <div className="mb-4 text-sm text-gray-700">
          <p><strong>Nama Lengkap:</strong> {pesanan.namaLengkap}</p>
          <p><strong>No WhatsApp:</strong> {pesanan.noWa}</p>
          <p><strong>Harga Paket:</strong> {formatRupiah(pesanan.harga)}</p>
        </div>

        <div>
          <p className="font-medium">Menu Pilihan:</p>
          <ul className="list-disc pl-5 mt-2 text-sm text-gray-600">
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
