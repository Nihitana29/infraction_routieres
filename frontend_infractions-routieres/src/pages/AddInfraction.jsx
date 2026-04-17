import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

function AddInfraction() {
  const [searchParams] = useSearchParams()
  const voitureId = searchParams.get("id")

  const [plaque, setPlaque] = useState("");
  const [type, setType] = useState("");
  const [montant, setMontant] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if(!voitureId) return

    const fetchVoiture = async () => {
      const response = await axios.get(`http://localhost:3000/api/voitures/${voitureId}`)
      setPlaque(response.data.plaque)
    }
    fetchVoiture()
  }, [voitureId])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const infraction = {
      plaque,
      type,
      montant
    }

    console.log(infraction);

    try {
      const response = await axios.post('http://localhost:3000/api/infractions', infraction)

      console.log(response.data);

      navigate("/infractions");
    } catch (error) {
      console.error(error) 
    }
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Ajouter une infraction
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Plaque"
            value={plaque}
            onChange={(e) => setPlaque(e.target.value)}
            className="w-full border border-gray-300 bg-gray-100 text-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            required
          />

          <input
            type="text"
            placeholder="Type d'infraction"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-300 bg-gray-100 text-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            required
          />

          <input
            type="number"
            placeholder="Montant"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            className="w-full border border-gray-300 bg-gray-100 text-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg shadow-md font-semibold hover:scale-105 transition"
          >
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddInfraction;