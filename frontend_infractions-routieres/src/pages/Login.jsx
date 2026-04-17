import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      <div className="bg-white p-10 shadow-2xl rounded-2xl w-96 border border-gray-100">

        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800 tracking-wide">
          Connexion
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 bg-gray-50 text-gray-700 p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full border border-gray-300 bg-gray-50 text-gray-700 p-3 mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <div className="flex flex-col space-y-4">

          {/* bouton login */}
          <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 transition text-white p-3 rounded-lg shadow-md font-semibold">
            Se connecter
          </button>

          {/* bouton register */}
          <Link
            to="/register"
            className="w-full text-center bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition text-white p-3 rounded-lg shadow-md font-semibold"
          >
            S'inscrire
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;