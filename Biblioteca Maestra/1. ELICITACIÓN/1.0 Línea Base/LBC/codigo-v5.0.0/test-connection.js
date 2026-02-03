/**
 * Script para probar la conexión a MongoDB
 * Ejecutar con: node test-connection.js
 */
import { MongoClient } from 'mongodb';

// Probar diferentes configuraciones
const configurations = [
  {
    name: 'Configuración Original',
    uri: 'mongodb+srv://gabo:gabo@bddshakira.l08bhec.mongodb.net/',
    dbName: 'staff_voucher_system'
  },
  {
    name: 'Sin autenticación',
    uri: 'mongodb+srv://bddshakira.l08bhec.mongodb.net/',
    dbName: 'staff_voucher_system'
  }
];

async function testConnection(config) {
  console.log(`\n🔄 Probando: ${config.name}`);
  console.log(`   URI: ${config.uri.replace(/:[^:@]+@/, ':****@')}`);
  
  try {
    const client = new MongoClient(config.uri, {
      serverSelectionTimeoutMS: 5000,
    });

    await client.connect();
    console.log('   ✅ Conexión exitosa!');
    
    const db = client.db(config.dbName);
    const collections = await db.listCollections().toArray();
    console.log(`   📁 Colecciones disponibles: ${collections.map(c => c.name).join(', ') || 'ninguna'}`);
    
    await client.close();
    return true;
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    if (error.code === 8000) {
      console.log('   💡 Sugerencia: Verifica el usuario y contraseña en MongoDB Atlas');
    }
    return false;
  }
}

async function main() {
  console.log('🧪 Test de Conexión MongoDB\n');
  console.log('=' .repeat(60));
  
  for (const config of configurations) {
    const success = await testConnection(config);
    if (success) {
      console.log('\n✅ ¡Conexión exitosa! Usa esta configuración en server.js');
      break;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📝 Instrucciones:');
  console.log('1. Ve a https://cloud.mongodb.com/');
  console.log('2. Database Access → Verifica usuario/contraseña');
  console.log('3. Network Access → Agrega tu IP o 0.0.0.0/0');
  console.log('4. Actualiza server.js con las credenciales correctas');
}

main();
