import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );
      navigate("/dashboard"); // Ensure this path matches your dashboard route
    } catch (err) {
      console.error("Login failed:", err.code, err.message);
      setError("Login failed: Invalid email or password.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded ">
      <h1 className="text-3xl font-extrabold text-center text-blue-700 tracking-tight mb-6">
        HVAC Quote Builder
      </h1>
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          ref={emailRef}
          required
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded"
        />
        <input
          type="password"
          ref={passwordRef}
          required
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
