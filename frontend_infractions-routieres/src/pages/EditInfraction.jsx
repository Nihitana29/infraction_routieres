import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function EditInfraction() {

  const { id } = useParams(); // récupérer id dans l'URL
  const navigate = useNavigate();

  const [plaque, setPlaque] = useState("");
  const [type, setType] = useState("");
  const [montant, setMontant] = useState("");

  useEffect(() => {
    const fetchInfraction = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/infractions/${id}`)
        const infraction = response.data

        setPlaque(infraction.voiture.plaque)
        setType(infraction.type)
        setMontant(infraction.montant)

      } catch (error) {
        console.error("Erreur lors du chargement", error);
      }
    }

    fetchInfraction()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`http://localhost:3000/api/infractions/update-infraction/${id}`, {
        plaque,
        type, 
        montant
      })

      console.log("Infraction mise à jour :", response.data);

      navigate("/infractions");
    } catch (error) {
      console.error(error);
    }

    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center p-6">

      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">

        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Modifier Infraction
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            value={plaque}
            onChange={(e) => setPlaque(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="number"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-semibold"
          >
            Modifier
          </button>

        </form>

      </div>

    </div>
  );
}

export default EditInfraction;