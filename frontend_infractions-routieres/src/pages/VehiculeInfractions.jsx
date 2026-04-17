import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function VehiculeInfractions() {
  const { id } = useParams(); // pour récupérer la plaque depuis l'URL

  // const infractions = [
  //   { type: "Excès vitesse", montant: 10000, statut: "NON PAYÉ" },
  //   { type: "Stationnement", montant: 5000, statut: "PAYÉ" },
  // ];

  const [ infractions, setInfractions ] = useState([])
  const [ plaque, setPlaque ] = useState("")

  useEffect(() => {
    const fetchInfractions = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/infractions/voiture/${id}`)
        console.log(response.data);
        setInfractions(response.data.infractions)
        setPlaque(response.data.voiture.plaque)
      } catch (error) {
        console.error(error);
        
      }
    }
    fetchInfractions()
  }, [id])

  const total = infractions.reduce((acc, i) => acc + i.montant, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-10">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Infractions du véhicule {plaque}
        </h1>

        {/* Bouton Ajouter Infraction */}
        <Link
          to={`/infractions/add?id=${id}`}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg shadow hover:scale-105 transition font-semibold"
        >
          + Ajouter Infraction
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">

        <table className="min-w-full">
          <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider text-sm">
            <tr>
              <th className="py-4 px-6 text-left">Type</th>
              <th className="py-4 px-6 text-left">Montant</th>
              <th className="py-4 px-6 text-left">Statut</th>
            </tr>
          </thead>

          <tbody>
            {infractions.map((i, idx) => (
              <tr key={idx} className="border-b hover:bg-purple-50 transition">
                <td className="py-4 px-6 text-gray-700 font-medium">{i.type}</td>
                <td className="py-4 px-6 text-gray-700">{i.montant} Ar</td>
                <td
                  className={`py-4 px-6 font-bold ${
                    i.statut === "paye" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {i.statut === "paye" ? "PAYÉ" : "NON PAYÉ"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      <div className="text-right text-xl font-bold text-gray-800">
        Total des amendes : {total} Ar
      </div>

    </div>
  );
}

export default VehiculeInfractions;