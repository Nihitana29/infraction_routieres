import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function Paiement() {
  const { id } = useParams()
  const navigate = useNavigate();

  const [ type, setType] = useState()
  const [ montant, setMontant] = useState()

  useEffect(() => {
    const fetchInfraction = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/infractions/${id}`)
        const infraction = response.data
        setType(infraction.type)
        setMontant(infraction.montant)
      } catch (error) {
        console.error("erreur lors du chargement", error);
      }
    }
    fetchInfraction()
  }, [id])

  const handlePaiement = async (id) => {
    try {
      await axios.post(`http://localhost:3000/api/paiement/${id}`)
      alert("Paiement enregistré")
      navigate("/infractions");
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Payer l'amende
        </h1>

        <p className="mb-4 text-gray-700 font-medium">Infraction : {type}</p>
        <p className="mb-6 text-gray-700 font-medium">Montant : {montant} Ar</p>

        <button
          onClick={() => handlePaiement(id)}
          className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white p-3 rounded-lg shadow-md font-semibold hover:scale-105 transition"
        >
          Payer
        </button>
      </div>
    </div>
  );
}

export default Paiement;