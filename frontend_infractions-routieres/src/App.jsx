import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Vehicules from "./pages/Vehicules";
import AddVehicule from "./pages/AddVehicule";
import EditVehicule from "./pages/EditVehicule";

import Infractions from "./pages/Infractions";
import AddInfraction from "./pages/AddInfraction";
import EditInfraction from "./pages/EditInfraction";

import VehiculeInfractions from "./pages/VehiculeInfractions";
import Paiement from "./pages/Paiement";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Page d'accueil */}
        <Route path="/" element={<Home />} />

        {/* Authentification */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Véhicules */}

        <Route
          path="/vehicules"
          element={
            <Layout>
              <Vehicules />
            </Layout>
          }
        />

        <Route
          path="/vehicules/add"
          element={
            <Layout>
              <AddVehicule />
            </Layout>
          }
        />

        <Route
          path="/vehicules/edit/:id"
          element={
            <Layout>
              <EditVehicule />
            </Layout>
          }
        />

        {/* Infractions */}

        <Route
          path="/infractions"
          element={
            <Layout>
              <Infractions />
            </Layout>
          }
        />

        <Route
          path="/infractions/add"
          element={
            <Layout>
              <AddInfraction />
            </Layout>
          }
        />

        <Route
          path="/infractions/edit/:id"
          element={
            <Layout>
              <EditInfraction />
            </Layout>
          }
        />

        {/* Infractions par véhicule */}

        <Route
          path="/vehicules/:id/infractions"
          element={
            <Layout>
              <VehiculeInfractions />
            </Layout>
          }
        />

        {/* Paiement */}

        <Route
          path="/paiement/:id"
          element={
            <Layout>
              <Paiement />
            </Layout>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;