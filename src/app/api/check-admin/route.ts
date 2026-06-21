import { sql } from "@/lib/db";

export async function GET() {
  try {
    const rows = await sql`
      SELECT COUNT(*) as count FROM admin_usuario WHERE rol = 'admin' AND activo = true
    `;

    const count = (rows[0].count as number) || 0;
    return Response.json({ exists: count > 0 });
  } catch (error) {
    console.error("[CHECK-ADMIN] Error:", error);
    return Response.json({ exists: false }, { status: 500 });
  }
}
