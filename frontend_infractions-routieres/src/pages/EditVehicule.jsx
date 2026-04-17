import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function EditVehicule() {
  const { id } = useParams(); // On récupère l'ID de la voiture à éditer
  const navigate = useNavigate();

  const [plaque, setPlaque] = useState("");
  const [proprietaire, setProprietaire] = useState("");
  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");

  useEffect(() => {
    const fetchVoiture = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/voitures/${id}`)
        const voiture = response.data

        setPlaque(voiture.plaque)
        setProprietaire(voiture.proprietaire)
        setMarque(voiture.marque)
        setModele(voiture.modele)

      } catch (error) {
        console.error("Erreur lors du chargement", error)
      }
    }
    fetchVoiture()
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:3000/api/voitures/update-voiture/${id}`, {
        plaque,
        proprietaire,
        marque,
        modele
      })
      console.log("Véhicule mis à jour", response.data);
      
      navigate("/vehicules");
    } catch (error) {
      console.error(error); 
    }
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center p-10">
      <div className="bg-white p-10 shadow-xl rounded-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Modifier le Véhicule
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
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white p-3 rounded-lg shadow hover:scale-105 transition font-semibold"
          >
            Enregistrer les modifications
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditVehicule;