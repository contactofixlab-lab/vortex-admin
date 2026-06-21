"use client";

import { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import { UsuarioRegistro } from "@/lib/usuarios";

interface UsuariosClientProps {
  usuarios: UsuarioRegistro[];
}

export default function UsuariosClient({ usuarios }: UsuariosClientProps) {
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      if (!fechaInicio && !fechaFin) return true;

      const fecha = new Date(u.createdAtRaw);
      const inicio = fechaInicio ? new Date(fechaInicio) : null;
      const fin = fechaFin ? new Date(fechaFin) : null;

      if (inicio && fecha < inicio) return false;
      if (fin) {
        const finConTiempo = new Date(fin);
        finConTiempo.setHours(23, 59, 59, 999);
        if (fecha > finConTiempo) return false;
      }

      return true;
    });
  }, [usuarios, fechaInicio, fechaFin]);

  function isConectado(ultimaConexion: string): boolean {
    return ultimaConexion.includes("Conectado ahora");
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header con estadísticas */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-orbitron)" }}>
            Registros de Usuarios
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {usuariosFiltrados.length} de {usuarios.length} usuario{usuarios.length !== 1 ? "s" : ""} registrado{usuarios.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Filtro por rango de fechas */}
      <div
        className="flex flex-col sm:flex-row gap-3 rounded-2xl p-4"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "var(--shadow-glass)",
        }}
      >
        <div className="flex items-center gap-2">
          <Calendar size={16} style={{ color: "var(--neon-cyan)" }} />
          <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Filtrar por fecha:</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="flex-1">
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              placeholder="Desde"
              className="w-full px-3 py-2 rounded-lg text-sm bg-transparent border"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <span className="flex items-center justify-center text-xs" style={{ color: "var(--text-muted)" }}>a</span>

          <div className="flex-1">
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              placeholder="Hasta"
              className="w-full px-3 py-2 rounded-lg text-sm bg-transparent border"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {(fechaInicio || fechaFin) && (
            <button
              onClick={() => {
                setFechaInicio("");
                setFechaFin("");
              }}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              style={{
                background: "rgba(255,79,216,0.1)",
                border: "1px solid rgba(255,79,216,0.3)",
                color: "var(--neon-pink)",
              }}
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "var(--shadow-glass)",
        }}
      >
        {usuariosFiltrados.length === 0 ? (
          <div className="px-6 py-12 text-center" style={{ color: "var(--text-muted)" }}>
            <p className="text-sm">
              {usuarios.length === 0
                ? "No hay usuarios registrados aún."
                : "No hay usuarios en el rango de fechas seleccionado."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: "var(--text-secondary)" }}>
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: "var(--text-secondary)" }}>
                    Usuario
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: "var(--text-secondary)" }}>
                    Correo
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: "var(--text-secondary)" }}>
                    Teléfono
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: "var(--text-secondary)" }}>
                    País
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: "var(--text-secondary)" }}>
                    Registro
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-xs" style={{ color: "var(--text-secondary)" }}>
                    Conexión
                  </th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario, idx) => {
                  const conectado = isConectado(usuario.ultimaConexion);

                  return (
                    <tr
                      key={usuario.id}
                      style={{
                        borderBottom:
                          idx !== usuariosFiltrados.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                      }}
                    >
                      <td className="px-4 py-3 text-sm" style={{ color: "var(--text-primary)" }}>
                        {usuario.nombre}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: "var(--neon-violet)" }}>
                        {usuario.username || "—"}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: "var(--neon-cyan)" }}>
                        {usuario.email}
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                        {usuario.telefono || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                        {usuario.pais || "—"}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--text-secondary)" }}>
                        {usuario.createdAt}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{
                              background: conectado ? "#39ff14" : "#ff0000",
                              boxShadow: conectado
                                ? "0 0 10px #39ff14, 0 0 20px #39ff14"
                                : "0 0 10px #ff0000, 0 0 20px #ff0000",
                              animation: conectado
                                ? "pulse-green 2s ease-in-out infinite"
                                : "pulse-red 2s ease-in-out infinite",
                            }}
                          />
                          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                            {usuario.ultimaConexion}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Estilos de animación */}
      <style>{`
        @keyframes pulse-green {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 10px #39ff14, 0 0 20px #39ff14;
          }
          50% {
            opacity: 0.7;
            box-shadow: 0 0 5px #39ff14, 0 0 10px #39ff14;
          }
        }

        @keyframes pulse-red {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000;
          }
          50% {
            opacity: 0.7;
            box-shadow: 0 0 5px #ff0000, 0 0 10px #ff0000;
          }
        }
      `}</style>
    </div>
  );
}
