import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../auth/Firebase"; // Pastikan path-nya sesuai

const Dashboard = () => {
  const [paketList, setPaketList] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "paket"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPaketList(data);
    });

    return () => unsub(); // Cleanup listener saat unmount
  }, []);

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  return (
    <div className="p-4 space-y-6">
      <div className="bg-green-100 border border-green-300 rounded-lg p-4 shadow">
        <h1 className="text-xl font-bold text-green-800 mb-1">
          Selamat Datang!
        </h1>
        <p className="text-green-700">
          Pusat kontrol untuk mengelola semua Data Makanan.
        </p>
      </div>

      {/* List Paket */}
      <div>
        <h2 className="text-lg font-semibold text-[#207f15] mb-3">
          Daftar Paket Internet
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paketList.length > 0 ? (
            paketList.map((paket) => (
              <div
                key={paket.id}
                className="border border-gray-200 rounded-lg p-4 shadow bg-white"
              >
                <h3 className="text-md font-bold text-gray-800 mb-2">
                  {paket.nama}
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>Download:</strong> {paket.download}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Upload:</strong> {paket.upload}
                </p>
                <p className="text-sm text-gray-700 mt-2 font-medium">
                  {formatRupiah(paket.harga)} / bulan
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Tidak ada Data Makanan tersedia.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
