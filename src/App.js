import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import SplashPage from "./pages/SplashPage";
import ProtectedRoute from "./ProtectedRoute";
import { ToastContainer } from "react-toastify"; // ✅ Tambahkan ini
import "react-toastify/dist/ReactToastify.css"; // ✅ Tambahkan ini juga
import Footer from "./component/Footer";
import DataPaketPage from "./pages/admin-page/DataPaketPage";
import DashboardPage from "./pages/admin-page/DashboardPage";
import DaftarPaketPage from "./pages/DaftarPaketPage";

function App() {
  return (
    <BrowserRouter>
      <>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route
            path="/masuk"
            element={
              <div>
                <Login />
                <Footer />
              </div>
            }
          />
          <Route
            path="/daftar-paket"
            element={
              <div>
                <DaftarPaketPage />
                <Footer />
              </div>
            }
          />
          <Route
            path="/paket"
            element={
              <ProtectedRoute>
                <DataPaketPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* ✅ Toast Container di luar <Routes> */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </>
    </BrowserRouter>
  );
}

export default App;
