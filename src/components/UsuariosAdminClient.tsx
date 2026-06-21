"use client";

import { useState } from "react";
import { crearUsuarioAdmin, actualizarRolUsuario, desactivarUsuario } from "@/app/admin-actions";
import { Plus, Trash2, Edit2, Lock, Mail, User, Shield } from "lucide-react";

interface Usuario {
  id: number;
  email: string;
  nombre: string;
  rol: string;
  activo: boolean;
  createdAt: string;
}

interface UsuariosAdminClientProps {
  usuariosIniciales: Usuario[];
  rolActual: string;
}

export default function UsuariosAdminClient({ usuariosIniciales, rolActual }: UsuariosAdminClientProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciales);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ email: "", nombre: "", password: "", rol: "creador" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const esAdmin = rolActual === "admin";

  async function handleCrearUsuario(e: React.FormEvent) {
    e.preventDefault();
    if (!esAdmin) return;

    setLoading(true);
    setError("");

    try {
      const res = await crearUsuarioAdmin(formData.email, formData.nombre, formData.password, formData.rol as any);
      if (res.ok) {
        setFormData({ email: "", nombre: "", password: "", rol: "creador" });
        setShowForm(false);
        // Recargar usuarios
        window.location.reload();
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError("Error al crear usuario");
    } finally {
      setLoading(false);
    }
  }

  async function handleActualizarRol(usuarioId: number, nuevoRol: string) {
    if (!esAdmin) return;

    try {
      const res = await actualizarRolUsuario(usuarioId, nuevoRol as any);
      if (res.ok) {
        setUsuarios(usuarios.map(u => u.id === usuarioId ? { ...u, rol: nuevoRol } : u));
        setEditingId(null);
      }
    } catch (err) {
      alert("Error al actualizar rol");
    }
  }

  async function handleDesactivar(usuarioId: number) {
    if (!esAdmin) return;
    if (!confirm("¿Desactivar este usuario?")) return;

    try {
      const res = await desactivarUsuario(usuarioId);
      if (res.ok) {
        setUsuarios(usuarios.map(u => u.id === usuarioId ? { ...u, activo: false } : u));
      }
    } catch (err) {
      alert("Error al desactivar usuario");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            Usuarios del Admin
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Gestiona permisos y roles de acceso
          </p>
        </div>
        {esAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
            style={{ padding: "8px 16px" }}>
            <Plus size={16} /> Nuevo usuario
          </button>
        )}
      </div>

      {/* Formulario */}
      {showForm && esAdmin && (
        <div className="glass-card p-5 rounded-lg"
          style={{ background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.1)" }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: "var(--neon-cyan)" }}>
            Crear nuevo usuario
          </h3>

          {error && (
            <div className="mb-4 p-3 rounded text-sm" style={{
              background: "rgba(255,45,120,0.1)",
              color: "var(--neon-pink)",
              border: "1px solid rgba(255,45,120,0.2)",
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleCrearUsuario} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: "var(--text-secondary)" }}>
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                  className="admin-input w-full text-sm"
                  placeholder="Juan Pérez"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: "var(--text-secondary)" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="admin-input w-full text-sm"
                  placeholder="juan@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: "var(--text-secondary)" }}>
                  Contraseña
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="admin-input w-full text-sm"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1" style={{ color: "var(--text-secondary)" }}>
                  Rol
                </label>
                <select
                  value={formData.rol}
                  onChange={e => setFormData({ ...formData, rol: e.target.value })}
                  className="admin-input w-full text-sm"
                  disabled={loading}>
                  <option value="creador">Creador</option>
                  <option value="marketing">Marketing</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={loading || !formData.email || !formData.nombre || !formData.password}
                className="btn-primary flex-1"
                style={{ opacity: loading || !formData.email ? 0.5 : 1 }}>
                Crear usuario
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-ghost flex-1">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de usuarios */}
      <div className="space-y-2">
        {usuarios.map(usuario => (
          <div
            key={usuario.id}
            className="glass-card p-4 flex items-center justify-between"
            style={{
              background: usuario.activo ? "rgba(255,255,255,0.02)" : "rgba(255,45,120,0.05)",
              opacity: usuario.activo ? 1 : 0.6,
            }}>
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: usuario.rol === "admin"
                    ? "rgba(191,95,255,0.15)"
                    : usuario.rol === "creador"
                      ? "rgba(0,245,255,0.15)"
                      : "rgba(57,255,20,0.15)",
                  color: usuario.rol === "admin"
                    ? "var(--neon-violet)"
                    : usuario.rol === "creador"
                      ? "var(--neon-cyan)"
                      : "#39ff14",
                }}>
                <Shield size={16} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {usuario.nombre}
                  {!usuario.activo && <span style={{ color: "var(--neon-pink)" }}> (inactivo)</span>}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {usuario.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {editingId === usuario.id && esAdmin ? (
                <select
                  value={usuario.rol}
                  onChange={e => handleActualizarRol(usuario.id, e.target.value)}
                  className="admin-input text-xs"
                  style={{ width: "100px" }}>
                  <option value="creador">Creador</option>
                  <option value="marketing">Marketing</option>
                  <option value="admin">Admin</option>
                </select>
              ) : (
                <span
                  className="text-xs font-semibold px-2 py-1 rounded"
                  style={{
                    background: usuario.rol === "admin"
                      ? "rgba(191,95,255,0.2)"
                      : usuario.rol === "creador"
                        ? "rgba(0,245,255,0.2)"
                        : "rgba(57,255,20,0.2)",
                    color: usuario.rol === "admin"
                      ? "var(--neon-violet)"
                      : usuario.rol === "creador"
                        ? "var(--neon-cyan)"
                        : "#39ff14",
                  }}>
                  {usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1)}
                </span>
              )}

              {esAdmin && usuario.activo && (
                <>
                  <button
                    onClick={() => setEditingId(editingId === usuario.id ? null : usuario.id)}
                    className="p-1.5 rounded transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    title="Editar rol">
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDesactivar(usuario.id)}
                    className="p-1.5 rounded transition-colors hover:bg-red-500/10"
                    style={{ color: "var(--neon-pink)" }}
                    title="Desactivar">
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {usuarios.length === 0 && (
        <div className="text-center py-8" style={{ color: "var(--text-muted)" }}>
          <User size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">No hay usuarios. Crea uno para comenzar.</p>
        </div>
      )}

      {!esAdmin && (
        <div className="p-4 rounded-lg text-sm" style={{
          background: "rgba(255,212,71,0.1)",
          border: "1px solid rgba(255,212,71,0.2)",
          color: "var(--neon-yellow)",
        }}>
          🔒 Solo los administradores pueden crear y gestionar usuarios.
        </div>
      )}
    </div>
  );
}
