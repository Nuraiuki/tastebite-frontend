import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginForm({ onSwitch }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleLogin = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Invalid email format";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const success = login(email, password);
    if (!success) {
      setErrors({ global: "Invalid email or password" });
    } else {
      navigate("/");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <h2 className="text-xl font-bold">Login</h2>


      <div>
        <input
          className="w-full border p-2"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

 
      <div>
        <input
          className="w-full border p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>


      {errors.global && <p className="text-red-500 text-sm">{errors.global}</p>}

      <button
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 w-full"
        type="submit"
      >
        Login
      </button>

      <p className="text-sm text-center mt-2">
        Don’t have an account?{" "}
        <span onClick={onSwitch} className="text-orange-600 cursor-pointer">
          Register
        </span>
      </p>
    </form>
  );
}
