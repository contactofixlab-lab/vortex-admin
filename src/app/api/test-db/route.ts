import { sql } from "@/lib/db";

export async function GET() {
  try {
    console.log("[TEST-DB] Testando conexión a Neon...");

    // Test 1: Simple query
    console.log("[TEST-DB] Ejecutando query simple...");
    const result1 = await sql`SELECT NOW()`;
    console.log("[TEST-DB] ✅ Query simple funcionó:", result1);

    // Test 2: Ver todas las tablas
    console.log("[TEST-DB] Listando tablas...");
    const tables = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public'
    `;
    console.log("[TEST-DB] Tablas encontradas:", tables.map(t => t.table_name));

    // Test 3: Contar usuarios admin
    console.log("[TEST-DB] Contando usuarios admin...");
    const users = await sql`SELECT COUNT(*) as count FROM admin_usuario`;
    console.log("[TEST-DB] Usuarios admin:", users);

    return Response.json({
      ok: true,
      message: "Conexión a Neon funciona correctamente",
      timestamp: new Date().toISOString(),
      tables: tables.map(t => t.table_name),
      adminUsers: users[0].count,
    });
  } catch (error) {
    console.error("[TEST-DB] ❌ Error:", error);
    return Response.json({
      ok: false,
      error: error instanceof Error ? error.message : "Error desconocido",
      stack: error instanceof Error ? error.stack : null,
    }, { status: 500 });
  }
}
