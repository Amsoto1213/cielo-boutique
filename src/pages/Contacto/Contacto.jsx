import React, { useState } from "react";
import { C, serif, sans } from "../../styles/tokens";
import { Sello } from "../../components/common/Marca";
import { EarthButton } from "../../components/common/Botones";

export function Contacto() {
  // 1. Estados para guardar la información del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    contacto: "",
    mensaje: "",
  });
  
  // Estado para manejar el botón y los mensajes de éxito/error
  const [estadoEnvio, setEstadoEnvio] = useState("inactivo"); // "inactivo", "enviando", "exito", "error"

  // 2. Función para actualizar los estados cuando el usuario escribe
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Función que se ejecuta al darle a "Enviar mensaje"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setEstadoEnvio("enviando");

    try {
      // Petición a la API gratuita de FormSubmit
      const response = await fetch("https://formsubmit.co/ajax/sotoromerostores@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          Nombre: formData.nombre,
          "Correo o Teléfono": formData.contacto,
          Mensaje: formData.mensaje,
          // Configuraciones extra de FormSubmit
          _subject: "Nuevo contacto desde la web - Cielo Boutique", 
          _template: "table", // Llega con un diseño de tabla ordenado
          _captcha: "false"   // Desactiva el captcha de redirección
        }),
      });

      if (response.ok) {
        setEstadoEnvio("exito");
        // Limpiamos el formulario
        setFormData({ nombre: "", contacto: "", mensaje: "" });
        
        // Volvemos al estado inicial después de 5 segundos
        setTimeout(() => setEstadoEnvio("inactivo"), 5000);
      } else {
        throw new Error("Error en la respuesta del servidor");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setEstadoEnvio("error");
      setTimeout(() => setEstadoEnvio("inactivo"), 5000);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-6 md:px-10 py-24 text-center">
      <Sello text="Hablemos" />
      <h1 className="text-3xl md:text-4xl mt-2 mb-6" style={{ ...serif, color: C.ink }}>
        Cuéntanos qué <em style={{ color: C.earth }}>buscas</em>
      </h1>
      <p style={{ ...sans, color: C.inkSoft }} className="mb-8">
        Asesoría de tallas, pedidos especiales o disponibilidad de piezas agotadas —
        respondemos en menos de 24 horas.
      </p>

      {/* 4. Cambiamos el div por un <form> para manejar el evento onSubmit */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm mx-auto text-left">
        <input 
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre" 
          required
          className="px-4 py-3 text-sm outline-none transition-colors focus:border-[#B88A5E]" 
          style={{ ...sans, border: `1px solid ${C.sand}` }} 
        />
        
        <input 
          type="text"
          name="contacto"
          value={formData.contacto}
          onChange={handleChange}
          placeholder="Correo electrónico o Teléfono" 
          required
          className="px-4 py-3 text-sm outline-none transition-colors focus:border-[#B88A5E]" 
          style={{ ...sans, border: `1px solid ${C.sand}` }} 
        />
        
        <textarea 
          name="mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          placeholder="Mensaje" 
          rows={4} 
          required
          className="px-4 py-3 text-sm outline-none transition-colors focus:border-[#B88A5E] resize-none" 
          style={{ ...sans, border: `1px solid ${C.sand}` }} 
        />
        
        <EarthButton disabled={estadoEnvio === "enviando" || estadoEnvio === "exito"} type="submit">
          {estadoEnvio === "enviando" && "Enviando..."}
          {estadoEnvio === "exito" && "¡Mensaje enviado!"}
          {estadoEnvio === "error" && "Error al enviar. Intenta de nuevo"}
          {estadoEnvio === "inactivo" && "Enviar mensaje"}
        </EarthButton>
      </form>
    </section>
  );
}