import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

function Vehicules() {

  // const vehicules = [
  //   { plaque: "1234 TAA", proprietaire: "Rakoto", marque: "Toyota", modele: "Corolla" },
  //   { plaque: "5678 TAA", proprietaire: "Rabe", marque: "Nissan", modele: "Sunny" },
  // ];

  const [ vehicules, setVehicules ] = useState([])

  const fetchVehicules = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/voitures')
      setVehicules(response.data)
    } catch (error) {
      console.error(error);
    }
  }
  
  useEffect(() => {
    fetchVehicules()
  }, [])

  const deleteVehicule = async (id) => {
    try {
      await axios.post(`http://localhost:3000/api/voitures/delete-voiture/${id}`)
      alert("Véhicule supprimée")
      fetchVehicules()
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-10">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Liste des Véhicules
        </h1>

        <Link
          to="/vehicules/add"
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg shadow hover:scale-105 transition font-semibold"
        >
          + Ajouter Véhicule
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        <table className="min-w-full">

          <thead className="bg-gray-100">
            <tr className="text-gray-600 text-sm uppercase tracking-wider">
              <th className="py-4 px-6 text-left">Plaque</th>
              <th className="py-4 px-6 text-left">Propriétaire</th>
              <th className="py-4 px-6 text-left">Marque</th>
              <th className="py-4 px-6 text-left">Modèle</th>
              <th className="py-4 px-6 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>

            {vehicules.map((v) => (
              <tr
                key={v._id}
                className="border-b hover:bg-blue-50 transition"
              >

                <td className="py-4 px-6 font-semibold text-blue-600">
                  {v.plaque}
                </td>

                <td className="py-4 px-6 text-gray-700">
                  {v.proprietaire}
                </td>

                <td className="py-4 px-6 text-gray-700">
                  {v.marque}
                </td>

                <td className="py-4 px-6 text-gray-700">
                  {v.modele}
                </td>

                <td className="py-4 px-6 space-x-4">

                  {/* Modifier */}
                  <Link
                    to={`/vehicules/edit/${v._id}`}
                    className="text-green-600 hover:text-green-800 font-medium"
                  >
                    Modifier
                  </Link>

                  {/* Voir infractions */}
                  <Link
                    to={`/vehicules/${v._id}/infractions`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Infractions
                  </Link>

                  {/* Supprimer */}
                  <button 
                    onClick={() => deleteVehicule(v._id)}
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

export default Vehicules;