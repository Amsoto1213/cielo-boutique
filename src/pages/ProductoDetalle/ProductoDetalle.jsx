import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { C, serif, sans } from "../../styles/tokens";
import { fetchProductoPorId, fetchSugeridos } from "../../api/productos";

export function ProductoDetalle({ onAdd }) {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [sugerencias, setSugerencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [imagenSeleccionada, setImagenSeleccionada] = useState("");
  const [tallaSeleccionada, setTallaSeleccionada] = useState("");
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const fetchProductoCompleto = async () => {
      setCargando(true);
      try {
        const data = await fetchProductoPorId(id);
        // Un producto desactivado no debe verse desde un link directo,
        // aunque siga existiendo en la base de datos por sus pedidos.
        setProducto(data && data.activo === false ? null : data);
        if (data && data.activo !== false) {
          setImagenSeleccionada(data.img);
          const datosSugeridos = await fetchSugeridos(data.categoria, id);
          setSugerencias(datosSugeridos);
        }
      } catch (err) {
        console.error("Error cargando detalle:", err.message);
      } finally {
        setCargando(false);
      }
    };

    if (id) fetchProductoCompleto();
  }, [id]);

  useEffect(() => {
    setTallaSeleccionada("");
    setCantidad(1);
  }, [id]);

  // Cada vez que cambia la talla elegida, la cantidad vuelve a 1 para no
  // arrastrar un número que quizás no exista en stock para la nueva talla.
  useEffect(() => {
    setCantidad(1);
  }, [tallaSeleccionada]);

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.ivory }}>
        <p style={{ ...sans, color: C.inkSoft }}>Cargando prenda...</p>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.ivory }}>
        <p style={{ ...sans, color: C.inkSoft }}>Prenda no encontrada.</p>
      </div>
    );
  }

  const imagenesGaleria = producto.producto_imagenes && producto.producto_imagenes.length > 0
    ? Array.from(new Set([producto.img, ...producto.producto_imagenes.map((imgObj) => imgObj.url)]))
    : [producto.img];

  const tallaInfo = producto.producto_tallas?.find((t) => t.talla === tallaSeleccionada);
  const stockDisponible = tallaInfo ? tallaInfo.stock : 0;

  const agregarAlCarrito = () => {
    if (!tallaSeleccionada) {
      alert("Por favor selecciona una talla");
      return;
    }
    if (cantidad < 1 || cantidad > stockDisponible) {
      alert("La cantidad seleccionada no está disponible en stock.");
      return;
    }

    // El carrito espera el producto con `tallas` como mapa { talla: stock },
    // igual que lo entregan Catálogo y Home. Aquí normalizamos el formato
    // que trae producto_tallas (array de filas) a ese mismo mapa.
    const productoParaCarrito = {
      id: producto.id,
      nombre: producto.nombre,
      categoria: producto.categoria,
      descripcion: producto.descripcion,
      precio: producto.precio,
      descuento: producto.descuento,
      img: producto.img,
      tallas: Object.fromEntries((producto.producto_tallas || []).map((t) => [t.talla, t.stock])),
    };

    if (onAdd) onAdd(productoParaCarrito, tallaSeleccionada, cantidad);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: C.white }}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div>
          <div className="w-full aspect-[3/4] mb-4 overflow-hidden bg-gray-50 border border-gray-100">
            <img
              src={imagenSeleccionada || producto.img}
              alt={producto.nombre}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          {imagenesGaleria.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {imagenesGaleria.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setImagenSeleccionada(url)}
                  className="w-20 aspect-[3/4] flex-shrink-0 border p-0.5 bg-white overflow-hidden transition-all"
                  style={{ borderColor: imagenSeleccionada === url ? C.earth : C.sand }}
                >
                  <img src={url} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <span style={{ ...sans, color: C.inkSoft }} className="text-xs uppercase tracking-widest block mb-2">
            {producto.categoria}
          </span>
          <h1 style={serif} className="text-3xl sm:text-4xl font-medium mb-4 text-[#5C4033]">
            {producto.nombre}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            {producto.descuento > 0 ? (
              <>
                <span style={sans} className="text-xl font-medium text-[#B88A5E]">
                  ${((producto.precio * (100 - producto.descuento)) / 100).toLocaleString()} COP
                </span>
                <span style={sans} className="text-sm line-through text-gray-400">
                  ${producto.precio.toLocaleString()} COP
                </span>
                <span style={sans} className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 font-medium tracking-wide uppercase">
                  -{producto.descuento}%
                </span>
              </>
            ) : (
              <span style={sans} className="text-xl font-medium text-[#5C4033]">
                ${producto.precio.toLocaleString()} COP
              </span>
            )}
          </div>

          <p style={{ ...sans, color: C.inkSoft }} className="text-sm leading-relaxed mb-8 whitespace-pre-line">
            {producto.descripcion || "Sin descripción disponible."}
          </p>

          <div className="mb-8">
            <span style={{ ...sans, color: C.ink }} className="text-xs uppercase tracking-wider block mb-3 font-medium">
              Selecciona tu talla
            </span>
            <div className="flex flex-wrap gap-3">
              {producto.producto_tallas && producto.producto_tallas.length > 0 ? (
                producto.producto_tallas.map((t) => {
                  const sinStock = t.stock <= 0;
                  const seleccionada = tallaSeleccionada === t.talla;
                  return (
                    <button
                      key={t.id}
                      disabled={sinStock}
                      onClick={() => setTallaSeleccionada(t.talla)}
                      className={`w-12 h-12 text-xs flex items-center justify-center border transition-all ${
                        sinStock ? "opacity-30 cursor-not-allowed line-through" : ""
                      }`}
                      style={{
                        ...sans,
                        backgroundColor: seleccionada ? C.earth : "transparent",
                        color: seleccionada ? C.white : C.ink,
                        borderColor: seleccionada ? C.earth : C.sand,
                      }}
                    >
                      {t.talla}
                    </button>
                  );
                })
              ) : (
                <p style={{ ...sans, color: C.inkSoft }} className="text-xs italic">No hay tallas disponibles</p>
              )}
            </div>
          </div>

          {tallaSeleccionada && (
            <div className="mb-8">
              <span style={{ ...sans, color: C.ink }} className="text-xs uppercase tracking-wider block mb-3 font-medium">
                Cantidad
              </span>
              {stockDisponible > 0 ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                      disabled={cantidad <= 1}
                      className="w-9 h-9 text-sm flex items-center justify-center border disabled:opacity-30"
                      style={{ borderColor: C.sand, color: C.ink }}
                    >
                      −
                    </button>
                    <span style={{ ...sans, color: C.ink }} className="text-sm w-6 text-center">{cantidad}</span>
                    <button
                      type="button"
                      onClick={() => setCantidad((c) => Math.min(stockDisponible, c + 1))}
                      disabled={cantidad >= stockDisponible}
                      className="w-9 h-9 text-sm flex items-center justify-center border disabled:opacity-30"
                      style={{ borderColor: C.sand, color: C.ink }}
                    >
                      +
                    </button>
                  </div>
                  <span style={{ ...sans, color: C.inkSoft }} className="text-xs">
                    {stockDisponible} {stockDisponible === 1 ? "disponible" : "disponibles"} en talla {tallaSeleccionada}
                  </span>
                </div>
              ) : (
                <p style={{ ...sans, color: C.inkSoft }} className="text-xs italic">
                  Sin stock disponible en talla {tallaSeleccionada}
                </p>
              )}
            </div>
          )}

          <button
            onClick={agregarAlCarrito}
            disabled={!tallaSeleccionada || stockDisponible === 0}
            className="w-full py-4 mt-2 text-xs uppercase tracking-[0.2em] font-medium transition-all text-white bg-[#B88A5E] hover:opacity-90 disabled:opacity-40 disabled:pointer-events-none"
          >
            Añadir a la bolsa
          </button>
        </div>
      </div>

      {sugerencias.length > 0 && (
        <div className="max-w-6xl mx-auto pt-16 border-t" style={{ borderColor: C.sand }}>
          <h2 style={serif} className="text-xl sm:text-2xl font-medium mb-10 text-[#5C4033] text-center tracking-wide">
            También te podría gustar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sugerencias.map((item) => (
              <Link key={item.id} to={`/producto/${item.id}`} className="group block text-decoration-none">
                <div className="w-full aspect-[3/4] mb-3 overflow-hidden bg-gray-50 border border-gray-100">
                  <img
                    src={item.img}
                    alt={item.nombre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <h3 style={serif} className="text-sm font-medium text-[#5C4033] truncate mb-1">{item.nombre}</h3>
                <p style={sans} className="text-xs text-[#B88A5E] font-medium">${item.precio.toLocaleString()} COP</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}