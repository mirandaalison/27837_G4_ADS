/**
 * SERVIDOR BACKEND - Express + MongoDB
 * Maneja todas las operaciones de base de datos
 */
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración MongoDB
const MONGODB_URI = 'mongodb+srv://gabriel:gabriel@bddshakira.l08bhec.mongodb.net/';
const DB_NAME = 'staff_voucher_system';

let db = null;
let client = null;

// Conectar a MongoDB
async function connectDB() {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
}

// Middleware para verificar conexión
app.use((req, res, next) => {
  if (!db) {
    return res.status(500).json({ error: 'Base de datos no disponible' });
  }
  next();
});

// =====================================================
// RUTAS - STAFF MEMBERS (RF02)
// =====================================================

// Importar staff desde Excel (guardar en DB)
app.post('/api/staff/import', async (req, res) => {
  try {
    const { records } = req.body;
    const collection = db.collection('staff_members');
    
    const result = await collection.insertMany(records);
    res.json({ 
      success: true, 
      message: 'Staff importado correctamente',
      insertedCount: result.insertedCount
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener todos los staff members
app.get('/api/staff', async (req, res) => {
  try {
    const collection = db.collection('staff_members');
    const staff = await collection.find({}).toArray();
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Buscar staff por cédula
app.get('/api/staff/:cedula', async (req, res) => {
  try {
    const collection = db.collection('staff_members');
    const staff = await collection.findOne({ cedula: req.params.cedula });
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Limpiar datos del staff
app.delete('/api/staff', async (req, res) => {
  try {
    const collection = db.collection('staff_members');
    await collection.deleteMany({});
    res.json({ success: true, message: 'Datos del staff eliminados' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// RUTAS - COMPROBANTES (RF03, RF04, RF05)
// =====================================================

// Registrar comprobante
app.post('/api/comprobantes', async (req, res) => {
  try {
    const collection = db.collection('comprobantes');
    const result = await collection.insertOne(req.body);
    res.json({ 
      success: true, 
      data: { ...req.body, _id: result.insertedId }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener todos los comprobantes
app.get('/api/comprobantes', async (req, res) => {
  try {
    const collection = db.collection('comprobantes');
    const comprobantes = await collection.find({}).sort({ fechaRegistro: -1 }).toArray();
    res.json({ success: true, data: comprobantes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener comprobante por ID
app.get('/api/comprobantes/:id', async (req, res) => {
  try {
    const collection = db.collection('comprobantes');
    const comprobante = await collection.findOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: true, data: comprobante });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Actualizar comprobante (subir documento, validar)
app.put('/api/comprobantes/:id', async (req, res) => {
  try {
    const collection = db.collection('comprobantes');
    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// RUTAS - PAGOS EXCEPCIONALES (RF10)
// =====================================================

// Registrar pago excepcional
app.post('/api/pagos-excepcionales', async (req, res) => {
  try {
    const collection = db.collection('pagos_excepcionales');
    const result = await collection.insertOne(req.body);
    res.json({ 
      success: true, 
      data: { ...req.body, _id: result.insertedId }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener todos los pagos excepcionales
app.get('/api/pagos-excepcionales', async (req, res) => {
  try {
    const collection = db.collection('pagos_excepcionales');
    const pagos = await collection.find({}).sort({ fechaRegistro: -1 }).toArray();
    res.json({ success: true, data: pagos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verificar pago excepcional
app.put('/api/pagos-excepcionales/:id/verificar', async (req, res) => {
  try {
    const collection = db.collection('pagos_excepcionales');
    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { estado: 'verificado', fechaVerificacion: new Date() } }
    );
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// RUTAS - GASTOS OPERATIVOS (RF11)
// =====================================================

// Registrar gasto operativo
app.post('/api/gastos-operativos', async (req, res) => {
  try {
    const collection = db.collection('gastos_operativos');
    const result = await collection.insertOne(req.body);
    res.json({ 
      success: true, 
      data: { ...req.body, _id: result.insertedId }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Obtener todos los gastos operativos
app.get('/api/gastos-operativos', async (req, res) => {
  try {
    const collection = db.collection('gastos_operativos');
    const gastos = await collection.find({}).sort({ fechaRegistro: -1 }).toArray();
    res.json({ success: true, data: gastos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Actualizar gasto operativo (subir documento, verificar)
app.put('/api/gastos-operativos/:id', async (req, res) => {
  try {
    const collection = db.collection('gastos_operativos');
    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// RUTAS - BÚSQUEDA (RF12)
// =====================================================

// Búsqueda con filtros
app.post('/api/busqueda', async (req, res) => {
  try {
    const { tipo, query } = req.body;
    const resultados = {};

    if (tipo === 'comprobantes' || tipo === 'todos') {
      const comprobantes = await db.collection('comprobantes').find(query).toArray();
      resultados.comprobantes = comprobantes;
    }

    if (tipo === 'gastos' || tipo === 'todos') {
      const gastos = await db.collection('gastos_operativos').find(query).toArray();
      resultados.gastos = gastos;
    }

    if (tipo === 'pagos' || tipo === 'todos') {
      const pagos = await db.collection('pagos_excepcionales').find(query).toArray();
      resultados.pagos = pagos;
    }

    const total = 
      (resultados.comprobantes?.length || 0) +
      (resultados.gastos?.length || 0) +
      (resultados.pagos?.length || 0);

    res.json({ success: true, data: resultados, totalResultados: total });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// INICIAR SERVIDOR
// =====================================================

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
  });
});

// Cerrar conexión al salir
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log('\n✅ Conexión a MongoDB cerrada');
  }
  process.exit(0);
});
