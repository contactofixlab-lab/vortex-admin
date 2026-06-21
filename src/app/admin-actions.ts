"use server";

import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";
import { crearSesionAdmin, destruirSesionAdmin } from "@/lib/auth-admin";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function loginAdmin(email: string, password: string): Promise<ActionResult> {
  const emailLimpio = email.trim().toLowerCase();

  try {
    const rows = await sql`
      SELECT id, password_hash, activo FROM admin_usuario
      WHERE email = ${emailLimpio}
      LIMIT 1
    `;

    if (rows.length === 0) {
      console.error(`[LOGIN] Usuario no encontrado: ${emailLimpio}`);
      return { ok: false, error: "Email o contraseña incorrectos." };
    }

    const usuario = rows[0];
    if (!usuario.activo) {
      console.error(`[LOGIN] Usuario inactivo: ${emailLimpio}`);
      return { ok: false, error: "El usuario está inactivo." };
    }

    const valido = await bcrypt.compare(password, usuario.password_hash as string);
    if (!valido) {
      console.error(`[LOGIN] Contraseña incorrecta para: ${emailLimpio}`);
      return { ok: false, error: "Email o contraseña incorrectos." };
    }

    await crearSesionAdmin(usuario.id as number);
    console.log(`[LOGIN] ✅ Sesión creada para: ${emailLimpio}`);
    return { ok: true };
  } catch (error) {
    console.error(`[LOGIN] Error:`, error);
    return { ok: false, error: "Error al iniciar sesión. Intenta nuevamente." };
  }
}

export async function cerrarSesionAdmin() {
  await destruirSesionAdmin();
}

export async function crearUsuarioAdmin(
  email: string,
  nombre: string,
  password: string,
  rol: "admin" | "creador" | "marketing"
): Promise<ActionResult> {
  const emailLimpio = email.trim().toLowerCase();
  const nombreLimpio = nombre.trim();

  if (!emailLimpio.includes("@")) {
    return { ok: false, error: "Email inválido." };
  }

  if (nombreLimpio.length < 2) {
    return { ok: false, error: "Nombre muy corto." };
  }

  if (password.length < 8) {
    return { ok: false, error: "La contraseña debe tener al menos 8 caracteres." };
  }

  if (!["admin", "creador", "marketing"].includes(rol)) {
    return { ok: false, error: "Rol inválido." };
  }

  try {
    const existente = await sql`
      SELECT 1 FROM admin_usuario WHERE email = ${emailLimpio} LIMIT 1
    `;

    if (existente.length > 0) {
      return { ok: false, error: "El email ya está registrado." };
    }

    const hash = await bcrypt.hash(password, 10);
    await sql`
      INSERT INTO admin_usuario (email, nombre, password_hash, rol)
      VALUES (${emailLimpio}, ${nombreLimpio}, ${hash}, ${rol})
    `;

    return { ok: true };
  } catch (err) {
    return { ok: false, error: "Error al crear usuario." };
  }
}

export async function actualizarRolUsuario(
  usuarioId: number,
  rol: "admin" | "creador" | "marketing"
): Promise<ActionResult> {
  try {
    await sql`
      UPDATE admin_usuario
      SET rol = ${rol}
      WHERE id = ${usuarioId}
    `;
    return { ok: true };
  } catch {
    return { ok: false, error: "Error al actualizar usuario." };
  }
}

export async function desactivarUsuario(usuarioId: number): Promise<ActionResult> {
  try {
    await sql`
      UPDATE admin_usuario
      SET activo = false
      WHERE id = ${usuarioId}
    `;
    return { ok: true };
  } catch {
    return { ok: false, error: "Error al desactivar usuario." };
  }
}

export async function obtenerTodosLosUsuariosAdmin() {
  try {
    const rows = await sql`
      SELECT id, email, nombre, rol, activo, created_at
      FROM admin_usuario
      ORDER BY created_at DESC
    `;

    return rows.map(r => ({
      id: r.id as number,
      email: r.email as string,
      nombre: r.nombre as string,
      rol: r.rol as string,
      activo: r.activo as boolean,
      createdAt: new Date(r.created_at as string).toLocaleString("es-CL"),
    }));
  } catch {
    return [];
  }
}
