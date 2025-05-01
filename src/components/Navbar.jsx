import { Link } from "react-router-dom";
import UserNav from "./UserNav";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center px-6 py-4 shadow bg-white sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-orange-600">
        🍽 TasteBite
      </Link>
      <UserNav />
    </header>
  );
}
