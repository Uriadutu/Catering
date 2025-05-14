import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../auth/Firebase";
import { useDispatch } from "react-redux";
import { setUser } from "../features/authSlice"; // Import the Redux action
import Logo from "../img/sp.png";


const Daftar = () => {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");
  const [Name, setName] = useState(""); // New state for the name
  const [ErrorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Dispatch function

  const handleSignUp = (e) => {
    e.preventDefault();

    if (Password !== ConfirmPassword) {
      setErrorMessage("Password dan konfirmasi password tidak cocok.");
      return;
    }

    createUserWithEmailAndPassword(auth, Username, Password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Menambahkan role "user" dan name ke Firestore
        try {
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            role: "user", // Default role
            name: Name, // Add the name here
          });

          // Dispatch user data to Redux
          dispatch(
            setUser({
              uid: user.uid,
              email: user.email,
              role: "user",
              name: Name,
            })
          );

          console.log("User created with role:", user);
          navigate("/masuk"); // Navigate to dashboard after successful registration
        } catch (error) {
          console.error("Error setting user role:", error.message);
          setErrorMessage("Terjadi kesalahan saat menyimpan data pengguna.");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/email-already-in-use") {
          setErrorMessage(
            "Email ini sudah terdaftar. Silakan gunakan email lain."
          );
        } else {
          setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
        }
        console.error("Error signing up:", error.message);
      });
  };

  return (
    <>
      <div className="relative min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="absolute top-0 left-0 w-full">
          <div className="container mx-auto px-4 md:px-12 py-6 flex justify-between items-center">
            <h1
              className="text-xl font-bold py-[7px]  text-[#6b5dff] cursor-pointer"
              onClick={() => navigate("/")}
              translate="no"
            >
              Catering
            </h1>
           
          </div>
          </div>

        <div className="w-full max-w-md mt-20 bg-white border border-[#6b5dff] rounded-xl p-8">
          <div className="flex flex-col items-center mb-6">
              <img src={Logo} alt="Logo" className="w-20 mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700">Daftar</h2>
            </div>
          {ErrorMessage && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md px-4 py-2 mb-4 text-center">
              {ErrorMessage}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Name Input Field */}
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6b5dff] outline-none text-sm"
              placeholder="Nama Pengguna"
              value={Name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Email Input Field */}
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6b5dff] outline-none text-sm"
              placeholder="Email"
              value={Username}
              onChange={(e) => setUsername(e.target.value)}
            />

            {/* Password Input Field */}
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6b5dff] outline-none text-sm"
              placeholder="Kata Sandi"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Confirm Password Input Field */}
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6b5dff] outline-none text-sm"
              placeholder="Konfirmasi Kata Sandi"
              value={ConfirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full py-3 bg-[#6b5dff] hover:bg-[#6b5dff] text-white rounded-lg font-medium transition"
            >
              Daftar
            </button>
          </form>

          <div className="mt-4 text-sm text-center">
            Sudah punya akun?{" "}
            <Link
              to="/masuk"
              className="text-[#6b5dff] font-medium hover:underline"
            >
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Daftar;