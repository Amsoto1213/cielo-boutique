import React from "react";
import { Routes, Route } from "react-router-dom";
import { Admin } from "./admin/Admin";
import { Tienda } from "./pages/Tienda";
import { ToastProvider } from "./context/ToastContext";

// App raíz — define únicamente las rutas reales de la aplicación.
export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/*" element={<Tienda />} />
      </Routes>
    </ToastProvider>
  );
}
