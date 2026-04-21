import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";

function Infractions() {

  // const infractions = [
  //   { id: 1, plaque: "1234 TAA", type: "Excès vitesse", montant: 10000, statut: "NON PAYÉ" },
  //   { id: 2, plaque: "5678 TAA", type: "Stationnement", montant: 5000, statut: "PAYÉ" },
  // ];

  const [ infractions, setInfractions ] = useState([])
  
  useEffect(() => {
    const fetchInfractions = async () => {
      try {
        const response = await api.get('/api/infractions/')
        setInfractions(response.data)
      } catch (error) {
        console.error("Erreur lors de la récupération des infractions:", error);
      }
    }
    fetchInfractions()
  }, [])

  const deleteInf = async (id) => {
    try {
      await api.delete(`/api/infractions/${id}`)
      alert("Infraction supprimée")
      const response = await api.get('/api/infractions/')
      setInfractions(response.data)
    } catch (error) {
      console.error("Erreur lors de la suppression de l'infraction:", error);
      alert("Impossible de supprimer l'infraction.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-10">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Infractions
        </h1>

        <Link
          to="/infractions/add"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg shadow hover:scale-105 transition font-semibold"
        >
          + Ajouter Infraction
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        <table className="min-w-full">

          <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider text-sm">
            <tr>
              <th className="py-4 px-6 text-left">Plaque</th>
              <th className="py-4 px-6 text-left">Type</th>
              <th className="py-4 px-6 text-left">Montant</th>
              <th className="py-4 px-6 text-left">Statut</th>
              <th className="py-4 px-6 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {infractions.map((i) => (
              <tr
                key={i._id}
                className="border-b hover:bg-purple-50 transition"
              >

                <td className="py-4 px-6 font-semibold text-blue-600">
                  {i.voiture?.plaque || "N/A"}
                </td>

                <td className="py-4 px-6 text-gray-700">
                  {i.type}
                </td>

                <td className="py-4 px-6 text-gray-700">
                  {i.montant} Ar
                </td>

                <td
                  className={`py-4 px-6 font-bold ${
                    i.statut === "paye"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {i.statut === "paye" ? "PAYÉ" : "NON PAYÉ"}
                </td>

                <td className="py-4 px-6 space-x-4">

                  {/* Modifier */}
                  <Link
                    to={`/infractions/edit/${i._id}`}
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    Modifier
                  </Link>

                  {/* Paiement */}
                  {i.statut === "impaye" && (
                    <Link
                      to={`/paiement/${i._id}`}
                      className="text-yellow-600 hover:text-yellow-800 font-medium"
                    >
                      Payer
                    </Link>
                  )}

                  {/* Supprimer */}
                  <button 
                    onClick={() => deleteInf(i._id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Supprimer
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
}

export default Infractions;