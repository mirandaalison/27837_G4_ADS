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
    console.log('[OK] Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('[ERROR] Error conectando a MongoDB:', error);
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
    console.log('\n[IMPORT] [IMPORTAR STAFF] Iniciando importación de staff desde Excel...');
    const { records } = req.body;
    console.log(`   [INFO] Cantidad de registros a importar: ${records.length}`);
    
    const collection = db.collection('staff_members');
    const result = await collection.insertMany(records);
    
    // Crear usuarios automáticamente para cada staff
    console.log('\n[USERS] [CREAR USUARIOS] Creando usuarios de staff...');
    const usersCollection = db.collection('users');
    const usuarios = records.map(staff => ({
      cedula: staff.cedula,
      email: staff.correo,
      password: staff.cedula, // La contraseña es la cédula
      name: staff.nombre,
      role: 'staff',
      createdAt: new Date()
    }));
    
    // Eliminar usuarios existentes del staff antes de crear nuevos
    await usersCollection.deleteMany({ role: 'staff' });
    const usersResult = await usersCollection.insertMany(usuarios);
    console.log(`   [OK] [CREAR USUARIOS] ${usersResult.insertedCount} usuarios creados`);
    
    console.log(`   [OK] [IMPORTAR STAFF] ${result.insertedCount} registros importados exitosamente`);
    res.json({ 
      success: true, 
      message: 'Staff importado correctamente y usuarios creados',
      insertedCount: result.insertedCount,
      usersCreated: usersResult.insertedCount
    });
  } catch (error) {
    console.log(`   [ERROR] [IMPORTAR STAFF] Error: ${error.message}`);
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
    console.log(`\n[SEARCH] [BUSCAR STAFF] Buscando staff con cédula: ${req.params.cedula}`);
    const collection = db.collection('staff_members');
    const staff = await collection.findOne({ cedula: req.params.cedula });
    
    if (staff) {
      console.log(`   [OK] [BUSCAR STAFF] Staff encontrado: ${staff.nombre}`);
    } else {
      console.log(`   [WARNING] [BUSCAR STAFF] No se encontró staff con esa cédula`);
    }
    
    res.json({ success: true, data: staff });
  } catch (error) {
    console.log(`   [ERROR] [BUSCAR STAFF] Error: ${error.message}`);
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
    console.log('\n[REGISTER] [REGISTRAR COMPROBANTE] Nuevo comprobante en proceso...');
    console.log(`   [USER] Staff: ${req.body.staffNombre} (${req.body.staffCedula})`);
    console.log(`   [VOUCHER] Número: ${req.body.numeroComprobante}`);
    console.log(`   [AMOUNT] Monto: $${req.body.monto}`);
    console.log(`   [PROVIDER] Proveedor: ${req.body.proveedor}`);
    
    const collection = db.collection('comprobantes');
    const result = await collection.insertOne(req.body);
    
    console.log(`   [OK] [REGISTRAR COMPROBANTE] Comprobante guardado con ID: ${result.insertedId}`);
    res.json({ 
      success: true, 
      data: { ...req.body, _id: result.insertedId }
    });
  } catch (error) {
    console.log(`   [ERROR] [REGISTRAR COMPROBANTE] Error: ${error.message}`);
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
    console.log(`\n[UPDATE] [ACTUALIZAR COMPROBANTE] Actualizando comprobante ID: ${req.params.id}`);
    
    if (req.body.estado) {
      console.log(`   [STATUS] Cambio de estado a: ${req.body.estado}`);
    }
    if (req.body.validadoDatosOficiales !== undefined) {
      console.log(`   [CHECK] Validación de datos oficiales: ${req.body.validadoDatosOficiales ? 'APROBADO' : 'RECHAZADO'}`);
    }
    if (req.body.validadoDocumento !== undefined) {
      console.log(`   [CHECK] Validación de documento: ${req.body.validadoDocumento ? 'APROBADO' : 'RECHAZADO'}`);
    }
    if (req.body.observaciones) {
      console.log(`   [NOTES] Observaciones: ${req.body.observaciones}`);
    }
    
    const collection = db.collection('comprobantes');
    const result = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    
    console.log(`   [OK] [ACTUALIZAR COMPROBANTE] Actualización exitosa`);
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.log(`   [ERROR] [ACTUALIZAR COMPROBANTE] Error: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Validar comprobante contra datos oficiales
app.post('/api/comprobantes/:id/validar', async (req, res) => {
  try {
    console.log(`\n[VALIDATE] [VALIDAR COMPROBANTE] Validando comprobante ID: ${req.params.id}`);
    
    const comprobantesCollection = db.collection('comprobantes');
    const comprobante = await comprobantesCollection.findOne({ _id: new ObjectId(req.params.id) });
    
    if (!comprobante) {
      console.log(`   [ERROR] [VALIDAR COMPROBANTE] Comprobante no encontrado`);
      return res.status(404).json({ 
        success: false, 
        message: 'Comprobante no encontrado' 
      });
    }

    console.log(`   [INFO] Comprobante: ${comprobante.numeroComprobante}`);
    console.log(`   [INFO] Staff Cédula: ${comprobante.staffCedula}`);
    
    // Buscar datos oficiales del staff
    const staffCollection = db.collection('staff_members');
    const staffMember = await staffCollection.findOne({ cedula: comprobante.staffCedula });
    
    if (!staffMember) {
      console.log(`   [ERROR] [VALIDAR COMPROBANTE] Staff no existe en datos oficiales`);
      
      // Actualizar comprobante como rechazado
      await comprobantesCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { 
          $set: { 
            estado: 'rechazado',
            observaciones: 'La factura no corresponde al trabajador - No existe en datos oficiales',
            validadoDatosOficiales: false
          } 
        }
      );
      
      return res.json({
        success: false,
        message: 'La factura no corresponde al trabajador',
        data: {
          comprobanteId: req.params.id,
          validacion: 'rechazado',
          motivo: 'No existe en datos oficiales'
        }
      });
    }

    console.log(`   [OK] [VALIDAR COMPROBANTE] Staff encontrado: ${staffMember.nombre}`);
    
    // Validar coincidencias
    const errores = [];

    // Validar nombre
    if (comprobante.staffNombre.toLowerCase() !== staffMember.nombre.toLowerCase()) {
      errores.push(`Nombre no coincide. Registrado: ${comprobante.staffNombre}, Oficial: ${staffMember.nombre}`);
    }

    // Validar monto asignado
    if (comprobante.monto > staffMember.montoAsignado) {
      errores.push(`Monto excede el asignado. Solicitado: $${comprobante.monto}, Asignado: $${staffMember.montoAsignado}`);
    }

    // Determinar resultado de la validación
    if (errores.length > 0) {
      console.log(`   [ERROR] [VALIDAR COMPROBANTE] Validación rechazada:`);
      errores.forEach(err => console.log(`      - ${err}`));
      
      await comprobantesCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { 
          $set: { 
            estado: 'rechazado',
            observaciones: errores.join('. '),
            validadoDatosOficiales: false
          } 
        }
      );

      return res.json({
        success: false,
        message: 'La factura no corresponde al trabajador',
        data: {
          comprobanteId: req.params.id,
          validacion: 'rechazado',
          errores: errores
        }
      });
    }

    // Validación exitosa
    console.log(`   [OK] [VALIDAR COMPROBANTE] Validación exitosa`);
    await comprobantesCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { 
        $set: { 
          validadoDatosOficiales: true,
          observaciones: 'Datos validados correctamente contra información oficial',
          estado: comprobante.validadoDocumento ? 'aprobado' : 'pendiente'
        } 
      }
    );

    res.json({
      success: true,
      message: 'Comprobante validado correctamente',
      data: {
        comprobanteId: req.params.id,
        validacion: 'aprobado',
        staffOficial: staffMember
      }
    });
  } catch (error) {
    console.log(`   [ERROR] [VALIDAR COMPROBANTE] Error: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// RUTAS - PAGOS EXCEPCIONALES (RF10)
// =====================================================

// Registrar pago excepcional
app.post('/api/pagos-excepcionales', async (req, res) => {
  try {
    console.log('\n[PAYMENT] [PAGO EXCEPCIONAL] Registrando pago excepcional...');
    console.log(`   [USER] Beneficiario: ${req.body.nombreBeneficiario}`);
    console.log(`   [AMOUNT] Monto: $${req.body.monto}`);
    console.log(`   [INFO] Concepto: ${req.body.concepto}`);
    
    const collection = db.collection('pagos_excepcionales');
    const result = await collection.insertOne(req.body);
    
    console.log(`   [OK] [PAGO EXCEPCIONAL] Pago registrado con ID: ${result.insertedId}`);
    res.json({ 
      success: true, 
      data: { ...req.body, _id: result.insertedId }
    });
  } catch (error) {
    console.log(`   [ERROR] [PAGO EXCEPCIONAL] Error: ${error.message}`);
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
    console.log('\n[EXPENSE] [GASTO OPERATIVO] Registrando gasto operativo...');
    console.log(`   [CATEGORY] Categoría: ${req.body.categoria}`);
    console.log(`   [AMOUNT] Monto: $${req.body.monto}`);
    console.log(`   [INFO] Descripción: ${req.body.descripcion}`);
    
    const collection = db.collection('gastos_operativos');
    const result = await collection.insertOne(req.body);
    
    console.log(`   [OK] [GASTO OPERATIVO] Gasto registrado con ID: ${result.insertedId}`);
    res.json({ 
      success: true, 
      data: { ...req.body, _id: result.insertedId }
    });
  } catch (error) {
    console.log(`   [ERROR] [GASTO OPERATIVO] Error: ${error.message}`);
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
// RUTAS - AUTENTICACIÓN (RF01)
// =====================================================

// Login de usuarios
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('\n[LOGIN] [LOGIN] Iniciando sesión...');
    const { identifier, password } = req.body;
    console.log(`   [USER] Identificador: ${identifier}`);
    
    // Buscar en usuarios predefinidos del sistema
    const systemUsers = [
      {
        id: 1,
        name: 'Juan Pérez - Jefe de Ticketera',
        email: 'jefe@ticketera.com',
        cedula: '1234567890',
        password: 'jefe123',
        role: 'jefe_ticketera'
      },
      {
        id: 2,
        name: 'María González - Contadora',
        email: 'contadora@empresa.com',
        cedula: '0987654321',
        password: 'conta123',
        role: 'contadora'
      },
      {
        id: 3,
        name: 'Carlos Rodríguez - Staff Demo',
        email: 'staff@evento.com',
        cedula: '1122334455',
        password: 'staff123',
        role: 'staff'
      }
    ];
    
    // Buscar en usuarios del sistema
    let user = systemUsers.find(u => 
      (u.email === identifier.trim() || u.cedula === identifier.trim()) && u.password === password
    );
    
    // Si no se encuentra, buscar en usuarios de staff de la BD
    if (!user) {
      const usersCollection = db.collection('users');
      const dbUser = await usersCollection.findOne({
        $or: [
          { email: identifier.trim() },
          { cedula: identifier.trim() }
        ],
        password: password
      });
      
      if (dbUser) {
        user = {
          id: dbUser._id.toString(),
          name: dbUser.name,
          email: dbUser.email,
          cedula: dbUser.cedula,
          role: dbUser.role
        };
        console.log(`   [OK] [LOGIN] Usuario staff encontrado en BD: ${user.name}`);
      }
    } else {
      console.log(`   [OK] [LOGIN] Usuario del sistema encontrado: ${user.name}`);
    }
    
    if (!user) {
      console.log(`   [ERROR] [LOGIN] Credenciales incorrectas`);
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales incorrectas' 
      });
    }
    
    console.log(`   [OK] [LOGIN] Inicio de sesión exitoso - Rol: ${user.role}`);
    res.json({ 
      success: true, 
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        cedula: user.cedula,
        role: user.role
      }
    });
  } catch (error) {
    console.log(`   [ERROR] [LOGIN] Error: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

// =====================================================
// RUTAS - BÚSQUEDA (RF12)
// =====================================================

// Búsqueda con filtros
app.post('/api/busqueda', async (req, res) => {
  try {
    console.log('\n[SEARCH] [BÚSQUEDA] Iniciando búsqueda...');
    const { tipo, query } = req.body;
    console.log(`   [INFO] Tipo de búsqueda: ${tipo}`);
    console.log(`   [INFO] Filtros aplicados:`, JSON.stringify(query, null, 2));
    
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

    console.log(`   [INFO] Resultados encontrados:`);
    if (resultados.comprobantes) console.log(`      - Comprobantes: ${resultados.comprobantes.length}`);
    if (resultados.gastos) console.log(`      - Gastos: ${resultados.gastos.length}`);
    if (resultados.pagos) console.log(`      - Pagos: ${resultados.pagos.length}`);
    console.log(`   [OK] [BÚSQUEDA] Total: ${total} registros encontrados`);

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
    console.log(`[START] Servidor backend corriendo en http://localhost:${PORT}`);
  });
});

// Cerrar conexión al salir
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log('\n[OK] Conexión a MongoDB cerrada');
  }
  process.exit(0);
});
