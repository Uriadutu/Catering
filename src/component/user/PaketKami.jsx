import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../auth/Firebase";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PesanPaketModal from "./PesanModal";  // Import modal pesan paket

const PaketKami = () => {
  const [packages, setPackages] = useState([]);
  const [menus, setMenus] = useState({});
  const [openModalAdd, setOpenModalAdd] = useState(false);  // Modal untuk pesan paket
  const [selectedPaket, setSelectedPaket] = useState(null);  // Paket yang dipilih
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

  const navigate = useNavigate();

  const handlePesanPaket = (paket) => {
    setSelectedPaket(paket);  // Set paket yang dipilih
    setOpenModalAdd(true);  // Tampilkan modal pesan paket
  };

  const toggleExpanded = (id) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="py-10 px-4 sm:px-0 mx-auto">
      <AnimatePresence>
        {openModalAdd && (
          <PesanPaketModal
            setIsOpenModalAdd={setOpenModalAdd}
            paket={selectedPaket}
            menus={menus[selectedPaket.id] || []}  // Kirim menu yang relevan
          />
        )}
      </AnimatePresence>
      <h2 className="text-2xl sm:text-4xl text-center font-bold text-gray-900 mb-5">
        Pilih Paket Makanan Terbaik
      </h2>
      <p className="text-center text-gray-600 mb-10">
        Nikmati berbagai pilihan paket makanan lezat dan bergizi untuk acara Anda.
      </p>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6">
        {packages.length > 0 ? (
          packages.slice(0, 8).map((pkg) => {
            const isExpanded = expandedMenus[pkg.id];
            const menuList = menus[pkg.id] || []; // menu dari paket terkait
            const firstFive = menuList.slice(0, 5);
            const remaining = menuList.slice(5);

            return (
              <div
                key={pkg.id}
                className="flex flex-col p-6 bg-orange-50 rounded-md border border-orange-300 transition duration-300 hover:scale-[1.01]"
              >
                <h3 className="text-lg text-center font-semibold text-orange-800 mb-4">
                  {pkg.nama}
                </h3>

                <div className="mb-3 text-sm text-gray-700">
                  <p className="font-medium mb-1">Menu Makanan:</p>
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
                      className="mt-2 text-sm text-orange-600 hover:underline"
                      onClick={() => toggleExpanded(pkg.id)}
                    >
                      {isExpanded ? "Tutup" : "Lihat Selengkapnya"}
                    </button>
                  )}
                </div>

                <p className="text-2xl font-bold text-orange-700 my-4 text-center">
                  {formatRupiah(pkg.harga)}
                </p>

                <button
                  onClick={() => handlePesanPaket(pkg)}  // Aksi untuk pesan paket
                  className="mt-auto w-full py-2 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600 transition duration-300"
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

export default PaketKami;
