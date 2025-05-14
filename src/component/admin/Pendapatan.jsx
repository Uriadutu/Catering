import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../auth/Firebase";
import { Link } from "react-router-dom";

const Pendapatan = () => {
  const [pesananList, setPesananList] = useState([]);
  const [totalPendapatan, setTotalPendapatan] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "pesanan"),
      where("status", "==", "diterima"),
      orderBy("tanggal", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        no: index + 1,
        ...doc.data(),
      }));
      setPesananList(data);

      // Hitung total pendapatan
      const total = data.reduce((acc, curr) => acc + (curr.harga || 0), 0);
      setTotalPendapatan(total);
    });

    return () => unsubscribe();
  }, []);

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  return (
    <div className=" sm:p-4" translate="no">
      <div className="grid grid-cols-1 sm:grid-cols-2 items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#6b5dff]">
          Pendapatan
        </h1>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm shadow-sm">
          <strong>Total Keuntungan:</strong> {formatRupiah(totalPendapatan)}
        </div>
      </div>
      <div className="w-full max-w-full overflow-x-auto">
        <div className="sm:w-auto w-3">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-800 uppercase text-xs">
              <tr>
                <th className="py-3 px-4 border">No</th>
                <th className="py-3 px-4 border">Nama Pembeli</th>
                <th className="py-3 px-4 border">Nama Paket</th>
                <th className="py-3 px-4 border">Harga Paket</th>
                <th className="py-3 px-4 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pesananList.length > 0 ? (
                pesananList.map((pesanan, index) => (
                  <tr key={pesanan.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border text-center">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4 border">{pesanan.namaLengkap}</td>
                    <td className="py-3 px-4 border">{pesanan.namaPaket}</td>
                    <td className="py-3 px-4 border">
                      {formatRupiah(pesanan.harga)}
                    </td>
                    <td className="py-3 px-4 border text-center">
                      <Link
                        to={`/detail-pesanan/${pesanan.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    Tidak ada data pesanan.
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

export default Pendapatan;
