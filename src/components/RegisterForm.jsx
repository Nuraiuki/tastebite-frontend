import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterForm({ onSwitch }) {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  const handleRegister = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Валидация
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Invalid email format";
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Проверка, что email ещё не зарегистрирован
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const alreadyExists = users.some((u) => u.email === email);
    if (alreadyExists) {
      newErrors.email = "User with this email already exists";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;


    const success = register(email, password, name);
    if (success) {
      navigate("/");
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <h2 className="text-xl font-bold">Register</h2>


      <div>
        <input
          className="w-full border p-2"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>


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
          placeholder="Password (min. 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>


      <button
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 w-full"
        type="submit"
      >
        Register
      </button>

     
      <p className="text-sm text-center mt-2">
        Already have an account?{" "}
        <span onClick={onSwitch} className="text-orange-600 cursor-pointer">
          Login
        </span>
      </p>
    </form>
  );
}
