import { obtenerTodosLosUsuarios } from "@/lib/usuarios";

export const metadata = { title: "Usuarios — Vortex Admin" };
export const revalidate = 0;

export default async function UsuariosPage() {
  const usuarios = await obtenerTodosLosUsuarios();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-orbitron)" }}>
          Registros de Usuarios
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          {usuarios.length} usuario{usuarios.length !== 1 ? "s" : ""} registrado{usuarios.length !== 1 ? "s" : ""}
        </p>
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
        {usuarios.length === 0 ? (
          <div className="px-6 py-12 text-center" style={{ color: "var(--text-muted)" }}>
            <p className="text-sm">No hay usuarios registrados aún.</p>
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
                  <th className="px-6 py-3.5 text-left font-semibold" style={{ color: "var(--text-secondary)" }}>
                    Nombre
                  </th>
                  <th className="px-6 py-3.5 text-left font-semibold" style={{ color: "var(--text-secondary)" }}>
                    Correo
                  </th>
                  <th className="px-6 py-3.5 text-left font-semibold" style={{ color: "var(--text-secondary)" }}>
                    Fecha de Registro
                  </th>
                  <th className="px-6 py-3.5 text-left font-semibold" style={{ color: "var(--text-secondary)" }}>
                    Última Conexión
                  </th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario, idx) => (
                  <tr
                    key={usuario.id}
                    style={{
                      borderBottom:
                        idx !== usuarios.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      background:
                        idx % 2 === 0
                          ? "transparent"
                          : "rgba(255,255,255,0.01)",
                    }}
                  >
                    <td className="px-6 py-3.5" style={{ color: "var(--text-primary)" }}>
                      {usuario.nombre}
                    </td>
                    <td
                      className="px-6 py-3.5 font-mono text-xs"
                      style={{ color: "var(--neon-cyan)" }}
                    >
                      {usuario.email}
                    </td>
                    <td className="px-6 py-3.5" style={{ color: "var(--text-secondary)" }}>
                      {usuario.createdAt}
                    </td>
                    <td className="px-6 py-3.5" style={{ color: "var(--text-secondary)" }}>
                      {usuario.ultimaConexion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
