import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function AddVehicule() {
  const [plaque, setPlaque] = useState("");
  const [proprietaire, setProprietaire] = useState("");
  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const voiture = {
      plaque,
      proprietaire,
      marque,
      modele
    }

    console.log(voiture);
    
    try {
      await api.post('/api/voitures/', voiture);

      navigate("/vehicules");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join('\\n');
        alert("Erreur: \\n" + errorMessages);
      } else {
        alert("Une erreur inattendue s'est produite lors de l'ajout.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center p-10">

      <div className="bg-white p-10 shadow-xl rounded-xl w-full max-w-md">

        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Ajouter un Véhicule
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            placeholder="Plaque"
            value={plaque}
            onChange={(e) => setPlaque(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />

          <input
            type="text"
            placeholder="Propriétaire"
            value={proprietaire}
            onChange={(e) => setProprietaire(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />

          <input
            type="text"
            placeholder="Marque"
            value={marque}
            onChange={(e) => setMarque(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />

          <input
            type="text"
            placeholder="Modèle"
            value={modele}
            onChange={(e) => setModele(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-lg shadow hover:scale-105 transition font-semibold"
          >
            Ajouter
          </button>

        </form>

      </div>
    </div>
  );
}

export default AddVehicule;