import "server-only";
import { randomBytes } from "crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { sql } from "./db";

const COOKIE_NAME = "vortex_admin_session";
const SESSION_DAYS = 30;

export type AdminRol = "admin" | "creador" | "marketing";

export type AdminUsuario = {
  id: number;
  email: string;
  nombre: string;
  rol: AdminRol;
  activo: boolean;
};

export async function crearSesionAdmin(usuarioId: number) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await sql`
    INSERT INTO admin_sesion (usuario_id, token, expires_at)
    VALUES (${usuarioId}, ${token}, ${expiresAt.toISOString()})
  `;

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function destruirSesionAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    await sql`DELETE FROM admin_sesion WHERE token = ${token}`;
  }
  cookieStore.delete(COOKIE_NAME);
}

export const getSesionAdmin = cache(async (): Promise<AdminUsuario | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const rows = await sql`
    SELECT u.id, u.email, u.nombre, u.rol, u.activo
    FROM admin_sesion s
    JOIN admin_usuario u ON u.id = s.usuario_id
    WHERE s.token = ${token} AND s.expires_at > now() AND u.activo = true
    LIMIT 1
  `;

  if (rows.length === 0) return null;
  return {
    id: rows[0].id as number,
    email: rows[0].email as string,
    nombre: rows[0].nombre as string,
    rol: rows[0].rol as AdminRol,
    activo: rows[0].activo as boolean,
  };
});

export function requiereRol(rolesPermitidos: AdminRol[]) {
  return async (usuario: AdminUsuario | null) => {
    if (!usuario) return false;
    return rolesPermitidos.includes(usuario.rol);
  };
}
