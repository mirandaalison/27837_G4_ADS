/**
 * CONFIGURACIÓN - Dummy para evitar errores de importación
 * El código del frontend ya NO se conecta directamente a MongoDB
 * Toda la comunicación se hace a través del backend API (server.js)
 */

class DatabaseConnection {
  static instance = null;

  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }
    DatabaseConnection.instance = this;
  }

  static getInstance() {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async connect() {
    console.warn('⚠️ Advertencia: La conexión directa a MongoDB desde el frontend está deshabilitada.');
    console.warn('⚠️ Use la API del backend en src/config/api.js en su lugar.');
    throw new Error('No se puede conectar a MongoDB desde el frontend. Use la API del backend.');
  }

  async disconnect() {
    // No-op
  }

  getDb() {
    throw new Error('No se puede acceder a la base de datos desde el frontend. Use la API del backend.');
  }

  getCollection(collectionName) {
    throw new Error('No se puede acceder a colecciones desde el frontend. Use la API del backend.');
  }
}

export default DatabaseConnection;
