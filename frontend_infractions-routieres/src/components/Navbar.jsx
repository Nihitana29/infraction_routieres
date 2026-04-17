import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-white px-8 py-4 flex justify-between items-center shadow-md border-b border-gray-200">

      {/* Logo / Titre */}
      <div className="font-extrabold text-xl text-gray-800 tracking-wide">
        🚓 Infractions Routières
      </div>

      {/* Menu */}
      <div className="flex items-center space-x-6">

        <Link
          to="/vehicules"
          className="text-gray-600 hover:text-blue-600 font-medium transition"
        >
          Véhicules
        </Link>

        <Link
          to="/infractions"
          className="text-gray-600 hover:text-purple-600 font-medium transition"
        >
          Infractions
        </Link>

        {/* <Link
          to="/paiement/1"
          className="text-gray-600 hover:text-green-600 font-medium transition"
        >
          Paiements
        </Link> */}

        {/* bouton logout stylé */}
        {/* <Link
          to="/login"
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition"
        >
          Logout
        </Link> */}

      </div>
    </nav>
  );
}

export default Navbar;