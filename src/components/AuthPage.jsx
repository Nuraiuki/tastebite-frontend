import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded shadow">
      {isLogin
        ? <LoginForm onSwitch={() => setIsLogin(false)} />
        : <RegisterForm onSwitch={() => setIsLogin(true)} />}
    </div>
  );
}
