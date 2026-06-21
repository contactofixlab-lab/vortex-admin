#!/usr/bin/env node

const bcrypt = require('bcryptjs');
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function createAdmin() {
  const email = 'admin@vortex.com';
  const nombre = 'Admin Vortex';
  const password = 'AdminVortex2024!';

  console.log('🔐 Generando hash de contraseña...');
  const passwordHash = await bcrypt.hash(password, 10);
  console.log('✅ Hash generado\n');

  console.log('📝 Credenciales:');
  console.log(`   Email: ${email}`);
  console.log(`   Contraseña: ${password}`);
  console.log(`   Hash: ${passwordHash}\n`);

  // Conectar a Neon
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('🔗 Conectado a Neon\n');

    // Eliminar usuario existente (si existe)
    console.log('🗑️  Limpiando usuarios previos...');
    await client.query('DELETE FROM admin_usuario WHERE email = $1', [email]);
    console.log('✅ Limpieza completada\n');

    // Insertar nuevo usuario
    console.log('➕ Creando usuario admin...');
    const result = await client.query(
      `INSERT INTO admin_usuario (email, nombre, password_hash, rol, activo)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, nombre, rol`,
      [email, nombre, passwordHash, 'admin', true]
    );

    console.log('✅ Usuario creado exitosamente!\n');
    console.log('📋 Detalles:');
    console.log(`   ID: ${result.rows[0].id}`);
    console.log(`   Email: ${result.rows[0].email}`);
    console.log(`   Nombre: ${result.rows[0].nombre}`);
    console.log(`   Rol: ${result.rows[0].rol}\n`);

    console.log('🚀 Ahora puedes acceder a /login con:');
    console.log(`   Email: ${email}`);
    console.log(`   Contraseña: ${password}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createAdmin();
