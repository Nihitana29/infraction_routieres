import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">

      <div className="bg-white p-10 shadow-2xl rounded-2xl w-96 border border-gray-100">

        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800 tracking-wide">
          Inscription
        </h2>

        <input
          type="text"
          placeholder="Nom"
          className="w-full border border-gray-300 bg-gray-50 text-gray-700 p-3 mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 bg-gray-50 text-gray-700 p-3 mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full border border-gray-300 bg-gray-50 text-gray-700 p-3 mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />

        <input
          type="password"
          placeholder="Confirmer mot de passe"
          className="w-full border border-gray-300 bg-gray-50 text-gray-700 p-3 mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />

        <div className="flex flex-col space-y-4">

          {/* bouton register */}
          <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition text-white p-3 rounded-lg shadow-md font-semibold">
            S'inscrire
          </button>

          {/* bouton login */}
          <Link
            to="/login"
            className="w-full text-center bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 transition text-white p-3 rounded-lg shadow-md font-semibold"
          >
            Retour au Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;