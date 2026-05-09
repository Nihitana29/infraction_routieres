import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-10">

      <h1 className="text-5xl font-extrabold text-gray-800 mb-4 text-center">
        Gestion des Infractions Routières
      </h1>

      <p className="text-gray-500 mb-12 text-lg text-center">
        Plateforme moderne pour gérer véhicules, infractions et paiements
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">

        <Link
          to="/vehicules"
          className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-2">Véhicules</h2>
          <p className="text-gray-500">Gérer les voitures et propriétaires</p>
        </Link>

        <Link
          to="/infractions"
          className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition"
        >
          <h2 className="text-2xl font-bold text-purple-600 mb-2">Infractions</h2>
          <p className="text-gray-500">Créer et consulter les infractions</p>
        </Link>

        {/* <Link
          to="/login"
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 rounded-xl text-center font-semibold hover:scale-105 transition"
        >
          Se connecter
        </Link>

        <Link
          to="/register"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl text-center font-semibold hover:scale-105 transition"
        >
          Créer un compte
        </Link> */}

      </div>

    </div>
  );
}

export default Home;