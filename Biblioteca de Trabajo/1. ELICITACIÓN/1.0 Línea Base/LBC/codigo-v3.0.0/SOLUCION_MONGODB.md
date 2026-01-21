# 🔧 INSTRUCCIONES DE CONFIGURACIÓN Y EJECUCIÓN

## ⚠️ PROBLEMA IDENTIFICADO

El driver de MongoDB **NO PUEDE ejecutarse en el navegador**. MongoDB es una biblioteca de Node.js que usa módulos nativos (`util`, `crypto`, `net`, `tls`) que no existen en navegadores.

**Error original:**
```
Module "util" has been externalized for browser compatibility
util.promisify is not a function
```

## ✅ SOLUCIÓN IMPLEMENTADA

Se creó una arquitectura **cliente-servidor**:

```
┌─────────────┐         HTTP/REST         ┌─────────────┐        MongoDB        ┌──────────────┐
│   React     │ ───────────────────────> │   Express   │ ───────────────────> │   MongoDB    │
│   Frontend  │         (fetch)           │   Backend   │      (mongodb)        │    Atlas     │
│  (Browser)  │ <─────────────────────── │  (Node.js)  │ <─────────────────── │              │
└─────────────┘         JSON              └─────────────┘        BSON           └──────────────┘
  Puerto 5173                               Puerto 5000
```

### Archivos Creados/Modificados

1. **`server.js`** - Servidor backend Express
   - Conecta a MongoDB Atlas
   - Expone API REST en `http://localhost:5000/api`
   - Maneja todas las operaciones CRUD

2. **`src/config/api.js`** - Cliente HTTP para el frontend
   - Clase `APIClient` con métodos para todas las operaciones
   - Reemplaza las llamadas directas a MongoDB

3. **`src/config/database.js`** - Deshabilitado
   - Ya NO importa MongoDB
   - Lanza errores si se intenta usar directamente

4. **`src/controllers/StaffController.js`** - Actualizado
   - Ahora usa `api.importStaff()` en lugar de MongoDB directo
   - Todos los métodos migrados a API REST

5. **`package.json`** - Configurado
   - Agregado `"type": "module"` para ES modules
   - Scripts: `npm run server`, `npm start`

## 🚨 ERROR ACTUAL: AUTENTICACIÓN MONGODB

```bash
❌ Error: bad auth : Authentication failed.
```

**Causa:** Las credenciales de MongoDB son incorrectas.

String de conexión actual:
```
mongodb+srv://gabo:gabo@bddshakira.l08bhec.mongodb.net/
```

### 📝 PASOS PARA CORREGIR

#### Opción 1: Actualizar Credenciales en MongoDB Atlas

1. Ve a [https://cloud.mongodb.com/](https://cloud.mongodb.com/)
2. Inicia sesión en tu cuenta
3. Ve a "Database Access" (Acceso a la Base de Datos)
4. Verifica/crea un usuario con permisos de lectura/escritura
5. Anota el **username** y **password** correctos
6. Ve a "Network Access" y asegúrate que tu IP esté en la lista blanca (o agrega `0.0.0.0/0` para acceso desde cualquier IP - solo para desarrollo)

7. Actualiza el string de conexión en `server.js` línea 20:
```javascript
const MONGODB_URI = 'mongodb+srv://USUARIO:PASSWORD@bddshakira.l08bhec.mongodb.net/';
```

Reemplaza `USUARIO` y `PASSWORD` con los valores correctos.

**IMPORTANTE:** Si la contraseña tiene caracteres especiales (`@`, `#`, `%`, etc.), debes codificarlos:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `:` → `%3A`

Ejemplo:
```javascript
// Si la contraseña es: P@ssw0rd!
const MONGODB_URI = 'mongodb+srv://gabo:P%40ssw0rd!@bddshakira.l08bhec.mongodb.net/';
```

#### Opción 2: Usar MongoDB Local (Alternativa)

Si no tienes acceso a MongoDB Atlas, puedes usar MongoDB local:

1. Instala MongoDB Community:
   ```bash
   winget install MongoDB.Server
   ```

2. Inicia MongoDB:
   ```bash
   mongod --dbpath C:\data\db
   ```

3. Actualiza `server.js` línea 20:
   ```javascript
   const MONGODB_URI = 'mongodb://localhost:27017/';
   ```

## 🚀 CÓMO EJECUTAR EL SISTEMA

### Paso 1: Corrige las credenciales de MongoDB
Edita `server.js` línea 20 con las credenciales correctas.

### Paso 2: Inicia el Backend
```bash
npm run server
```

Deberías ver:
```
✅ Conectado a MongoDB Atlas
🚀 Servidor backend corriendo en http://localhost:5000
```

### Paso 3: Inicia el Frontend (en otra terminal)
```bash
npm run dev
```

Deberías ver:
```
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Paso 4: Abre el Navegador
Visita: `http://localhost:5173/`

## 📡 RUTAS DE LA API

El backend expone las siguientes rutas:

### Staff Members
- `POST /api/staff/import` - Importar staff desde Excel
- `GET /api/staff` - Obtener todos
- `GET /api/staff/:cedula` - Buscar por cédula
- `DELETE /api/staff` - Limpiar datos

### Comprobantes
- `POST /api/comprobantes` - Crear comprobante
- `GET /api/comprobantes` - Obtener todos
- `GET /api/comprobantes/:id` - Obtener por ID
- `PUT /api/comprobantes/:id` - Actualizar comprobante

### Pagos Excepcionales (RF10)
- `POST /api/pagos-excepcionales` - Registrar pago
- `GET /api/pagos-excepcionales` - Obtener todos
- `PUT /api/pagos-excepcionales/:id/verificar` - Verificar pago

### Gastos Operativos (RF11)
- `POST /api/gastos-operativos` - Registrar gasto
- `GET /api/gastos-operativos` - Obtener todos
- `PUT /api/gastos-operativos/:id` - Actualizar gasto

### Búsqueda (RF12)
- `POST /api/busqueda` - Buscar con filtros

## 🧪 PROBAR LA API (Opcional)

Puedes probar las rutas con curl o Postman:

```bash
# Verificar que el servidor esté corriendo
curl http://localhost:5000/api/staff

# Importar staff (ejemplo)
curl -X POST http://localhost:5000/api/staff/import \
  -H "Content-Type: application/json" \
  -d '{"records":[{"cedula":"123","nombre":"Juan","apellidos":"Perez","telefono":"099123456","correo":"juan@mail.com","cargo":"Staff"}]}'
```

## ⚙️ CONFIGURACIÓN DE VITE

Si el frontend y backend están en puertos diferentes, Vite puede tener problemas de CORS. Ya está configurado en el backend:

```javascript
app.use(cors()); // En server.js
```

Si necesitas configurar un proxy en Vite, edita `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});
```

## 🔍 DEPURACIÓN

### Backend no se conecta a MongoDB
- Verifica credenciales en `server.js`
- Verifica que tu IP esté en "Network Access" de MongoDB Atlas
- Prueba la conexión con MongoDB Compass

### Frontend no se comunica con Backend
- Verifica que el backend esté corriendo: `http://localhost:5000/api/staff`
- Revisa la consola del navegador (F12) para errores de red
- Verifica que `src/config/api.js` tenga la URL correcta: `http://localhost:5000/api`

### Errores de CORS
- Asegúrate que `cors` esté instalado y configurado en `server.js`
- Reinicia el servidor backend

## 📊 ESTADO ACTUAL

✅ **Completado:**
- Backend Express con todas las rutas API
- Cliente HTTP para el frontend
- Migraciones de StaffController
- Estructura de base de datos
- 3 nuevos requisitos (RF10, RF11, RF12)

❌ **Pendiente:**
1. **CRÍTICO:** Corregir credenciales de MongoDB
2. Migrar completamente `ComprobanteController` para usar API
3. Migrar `PagoExcepcionalController` para usar API
4. Migrar `GastoOperativoController` para usar API
5. Migrar `BusquedaController` para usar API
6. Actualizar todas las vistas para manejar respuestas asíncronas de la API

## 📚 PRÓXIMOS PASOS

1. **Corrige las credenciales de MongoDB** en `server.js`
2. Inicia el backend: `npm run server`
3. En otra terminal, inicia el frontend: `npm run dev`
4. Prueba la funcionalidad de importar staff
5. Si funciona, continuaremos migrando los demás controladores

---

**¿Tienes las credenciales correctas de MongoDB Atlas?**
Por favor proporciónamelas para actualizar `server.js`.
