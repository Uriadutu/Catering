import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../auth/Firebase";
import Logo from "../img/sp.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setResetMessage("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/paket");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("Pengguna tidak ditemukan.");
      } else if (err.code === "auth/wrong-password") {
        setError("Kata sandi salah.");
      } else if (err.code === "auth/invalid-email") {
        setError("Email tidak valid.");
      } else {
        setError("Gagal Masuk. Periksa kembali email dan kata sandi.");
      }
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setResetMessage("");

    if (!email) {
      setError("Masukkan email terlebih dahulu.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("Email pengaturan ulang telah dikirim.");
    } catch {
      setError("Gagal mengirim email reset password.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Kiri */}
      <div className="md:w-1/2 bg-[#6b5dff] text-white flex flex-col justify-center items-center p-10">
        <img src={Logo} alt="Logo" className="w-24 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Selamat Datang!</h1>
        <p className="text-center max-w-sm text-sm">
          Halaman ini khusus untuk penjual. Silakan masuk untuk mengelola
          pesanan catering.
        </p>
      </div>

      {/* Kanan */}
      <div className="md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white shadow-lg border border-[#6b5dff] rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center text-[#6b5dff] mb-6">
            Masuk Akun
          </h2>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-4 py-2 mb-4 text-center">
              {error}
            </div>
          )}
          {resetMessage && (
            <div className="text-[#6b5dff] text-sm bg-[#f5f3ff] border border-[#6b5dff] rounded-md px-4 py-2 mb-4 text-center">
              {resetMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#6b5dff] outline-none text-sm"
              placeholder="Alamat Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-2 focus:ring-[#6b5dff] outline-none text-sm"
              placeholder="Kata Sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full py-3 bg-[#6b5dff] hover:bg-[#584ae1] text-white rounded font-semibold transition"
            >
              Masuk
            </button>
          </form>

          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[#6b5dff] hover:underline"
            >
              Lupa kata sandi?
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Tidak punya akun?{" "}
            <Link to="/" className="text-[#6b5dff] font-medium hover:underline">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
