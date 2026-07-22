import React from "react";
import { Routes, Route } from "react-router-dom";
import { Admin } from "./admin/Admin";
import { Tienda } from "./pages/Tienda";

// App raíz — define únicamente las rutas reales de la aplicación.
export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/*" element={<Tienda />} />
    </Routes>
  );
}
