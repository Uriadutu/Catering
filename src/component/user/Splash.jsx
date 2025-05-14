import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../auth/Firebase";
import { AnimatePresence } from "framer-motion";
import PesanPaketModal from "./PesanModal"; // Import modal pesan paket

const Splash = () => {
  const [packages, setPackages] = useState([]);
  const [menus, setMenus] = useState({});
  const [openModalAdd, setOpenModalAdd] = useState(false); // Modal untuk pesan paket
  const [selectedPaket, setSelectedPaket] = useState(null); // Paket yang dipilih
  const [expandedMenus, setExpandedMenus] = useState({});

  useEffect(() => {
    // Ambil data paket
    const unsubscribePaket = onSnapshot(collection(db, "paket"), (snapshot) => {
      const paketData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPackages(paketData);

      // Setelah paket diambil, ambil menu terkait dengan idPaket
      paketData.forEach((paket) => {
        const unsubscribeMenu = onSnapshot(
          query(collection(db, "menu"), where("idPaket", "==", paket.id)),
          (menuSnapshot) => {
            const menuData = menuSnapshot.docs.map((doc) => doc.data());
            setMenus((prevMenus) => ({
              ...prevMenus,
              [paket.id]: menuData,
            }));
          }
        );

        // Unsubscribe menu ketika paket dihapus
        return () => unsubscribeMenu();
      });
    });

    // Cleanup
    return () => unsubscribePaket();
  }, []);

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);

  const handlePesanPaket = (paket) => {
    setSelectedPaket(paket); // Set paket yang dipilih
    setOpenModalAdd(true); // Tampilkan modal pesan paket
  };

  const toggleExpanded = (id) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="py-10 mt-20 px-4 sm:px-0 mx-auto">
      <AnimatePresence>
        {openModalAdd && (
          <PesanPaketModal
            setIsOpenModalAdd={setOpenModalAdd}
            paket={selectedPaket}
            menus={menus[selectedPaket.id] || []} // Kirim menu yang relevan
          />
        )}
      </AnimatePresence>
      <h2 className="text-2xl sm:text-4xl text-center font-bold text-gray-900 mb-5">
        Pilihan Paket Makanan Terbaik untuk Anda dari{" "}
        <span className="text-[#6b5dff]"> Catering</span>
      </h2>

      <p className="text-center text-gray-600 mb-10">
        Nikmati berbagai pilihan paket makanan lezat dan bergizi untuk acara
        Anda.
      </p>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {packages.length > 0 ? (
          packages.slice(0, 8).map((pkg) => {
            const isExpanded = expandedMenus[pkg.id];
            const menuList = menus[pkg.id] || [];
            const firstFive = menuList.slice(0, 5);
            const remaining = menuList.slice(5);

            return (
              <div
                key={pkg.id}
                className="flex flex-col p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300 hover:scale-[1.01]"
              >
                <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
                  {pkg.nama}
                </h3>

                <div className="mb-3 text-sm text-gray-700">
                  <p className="font-medium mb-2 text-gray-800">
                    Menu Makanan:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-left">
                    {firstFive.map((menu, idx) => (
                      <li key={idx}>{menu.namaMenu}</li>
                    ))}
                    {isExpanded &&
                      remaining.map((menu, idx) => (
                        <li key={idx + 5}>{menu.namaMenu}</li>
                      ))}
                  </ul>

                  {menuList.length > 5 && (
                    <button
                      className="mt-2 text-sm text-[#6b5dff] hover:underline"
                      onClick={() => toggleExpanded(pkg.id)}
                    >
                      {isExpanded ? "Tutup" : "Lihat Selengkapnya"}
                    </button>
                  )}
                </div>

                <p className="text-2xl font-bold text-gray-900 my-4 text-center">
                  {formatRupiah(pkg.harga)}
                </p>

                <button
                  onClick={() => handlePesanPaket(pkg)}
                  className="mt-auto w-full py-2 rounded-lg bg-[#6b5dff] text-white font-semibold text-sm hover:bg-blue-500 transition duration-300"
                >
                  Pilih Paket
                </button>
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500">
            Belum ada paket tersedia.
          </p>
        )}
      </div>
    </div>
  );
};

export default Splash;
