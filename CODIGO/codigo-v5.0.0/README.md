# Sistema de Gestión de Comprobantes de Staff - Con MongoDB

## 🎯 Requisitos Funcionales Implementados

### ✅ Requisitos Originales (RF01-RF05)
- **RF01**: Login con validación de credenciales y redirección según rol
- **RF02**: Importación de Excel con validación de estructura  
- **RF03**: Registro de comprobantes con validación de campos
- **RF04**: Subida de documentos (PDF/imágenes)
- **RF05**: Validación contra datos oficiales del staff

### ✅ Nuevos Requisitos (RF10-RF12)
- **RF10**: Registro de pagos excepcionales (Contadora)
- **RF11**: Registro de gastos operativos con comprobantes (Jefe/Contadora)
- **RF12**: Búsqueda y filtrado de registros con auditoría (Jefe/Contadora)

## 🏗️ Arquitectura y Patrones de Diseño

### Patrones Implementados
1. **MVC (Model-View-Controller)**: Separación clara de responsabilidades
2. **Singleton**: SessionManager, NotificationSystem, DatabaseConnection
3. **Factory Method**: UserFactory para creación de usuarios según rol
4. **Observer**: NotificationSystem para manejo de notificaciones

### Estructura del Proyecto
```
src/
├── config/
│   └── database.js              # Conexión MongoDB (Singleton)
├── models/                      # Modelos MVC
│   ├── UserModel.js
│   ├── StaffMemberModel.js
│   ├── ComprobanteModel.js
│   ├── PagoExcepcionalModel.js
│   └── GastoOperativoModel.js
├── controllers/                 # Controladores MVC
│   ├── AuthController.js
│   ├── StaffController.js       # Con MongoDB
│   ├── ComprobanteController.js # Con MongoDB
│   ├── PagoExcepcionalController.js  # RF10
│   ├── GastoOperativoController.js   # RF11
│   ├── BusquedaController.js         # RF12
│   └── GlobalControllers.js
├── patterns/                    # Patrones de Diseño
│   ├── Singleton/
│   │   └── SessionManager.js
│   ├── FactoryMethod/
│   │   └── UserFactory.js
│   └── Observer/
│       └── NotificationSystem.js
└── views/                       # Vistas React
    ├── Login/
    ├── JefeTicketera/
    ├── Staff/
    ├── Validacion/
    ├── Contadora/               # RF10
    └── Shared/                  # RF11, RF12
```

## 🗄️ Configuración de MongoDB

### Conexión Configurada
```javascript
URI: mongodb+srv://gabo:gabo@bddshakira.l08bhec.mongodb.net/
Database: staff_voucher_system
```

### Colecciones Creadas Automáticamente
- `staff_members` - Datos oficiales del staff (RF02)
- `comprobantes` - Comprobantes del staff (RF03/RF04/RF05)
- `pagos_excepcionales` - Pagos manuales (RF10)
- `gastos_operativos` - Gastos con comprobantes (RF11)

## 🚀 Instalación y Ejecución

### 1. Instalar Dependencias
```powershell
npm install
```

**Dependencias instaladas**:
- `react` - Framework UI
- `react-router-dom` - Navegación SPA
- `xlsx` - Procesamiento de Excel
- `mongodb` - Driver oficial de MongoDB
- `vite` - Build tool

### 2. Iniciar el Servidor de Desarrollo
```powershell
npm run dev
```

El sistema estará disponible en: http://localhost:3000

### 3. Conexión a MongoDB
La conexión se establece automáticamente al usar cualquier controlador que interactúe con la base de datos. El sistema usa un patrón Singleton para mantener una única conexión activa.

## 👥 Usuarios de Prueba

| Email | Cédula | Contraseña | Rol |
|-------|--------|------------|-----|
| jefe@ticketera.com | 1234567890 | jefe123 | jefe_ticketera |
| contadora@empresa.com | 0987654321 | conta123 | contadora |
| staff@evento.com | 1122334455 | staff123 | staff |

## 📊 Funcionalidades por Rol

### 👔 Jefe de Ticketera
- ✅ Importar Excel con datos del staff (RF02)
- ✅ Validar comprobantes (RF05)
- ✅ Registrar gastos operativos (RF11)
- ✅ Búsqueda y filtrado de registros (RF12)

### 💼 Contadora
- ✅ Validar comprobantes (RF05)
- ✅ Registrar pagos excepcionales (RF10)
- ✅ Registrar gastos operativos (RF11)
- ✅ Búsqueda y filtrado de registros (RF12)

### 👤 Staff
- ✅ Registrar comprobantes (RF03)
- ✅ Subir documentos (RF04)

## 📝 Flujo de Trabajo Completo

### Flujo Normal de Comprobantes
1. **Jefe** importa datos oficiales del staff desde Excel (RF02)
2. **Staff** registra comprobante con sus datos (RF03)
3. **Staff** sube documento de respaldo (PDF/imagen) (RF04)
4. **Jefe/Contadora** valida contra datos oficiales (RF05)

### Flujo de Pagos Excepcionales (RF10)
1. **Contadora** registra pago manual fuera del flujo común
2. Sistema guarda en MongoDB con auditoría completa

### Flujo de Gastos Operativos (RF11)
1. **Jefe/Contadora** registra gasto con comprobante
2. Sube documento de respaldo adjunto
3. Sistema organiza para auditorías futuras

### Búsqueda y Auditoría (RF12)
1. **Jefe/Contadora** aplica filtros (fechas, montos, proveedor, etc.)
2. Sistema busca en todas las colecciones
3. Genera reporte con estadísticas

## 🎨 Diseño UI

### Paleta de Colores
- **Principal**: Cyan (#0891b2)
- **Secundario**: Dark Cyan (#0e7490)
- **Grises**: Slate scale
- **Fondo**: White
- **Tipografía**: Inter (Google Fonts)

## ✅ Principios SOLID Cumplidos

| Principio | Implementación |
|-----------|----------------|
| **S** - Single Responsibility | Cada modelo/controlador tiene una responsabilidad única |
| **O** - Open/Closed | Herencia en UserFactory permite extensión sin modificación |
| **L** - Liskov Substitution | Subclases de User son intercambiables |
| **I** - Interface Segregation | Métodos específicos por rol (getPermissions) |
| **D** - Dependency Inversion | Uso de Singleton, Factory, Observer |

## 🔒 Validaciones Implementadas

### Validación de Datos
- ✅ Campos obligatorios en formularios
- ✅ Formato de cédula (10 dígitos)
- ✅ Formato de email
- ✅ Montos positivos
- ✅ Estructura de Excel (columnas requeridas)

### Validación de Archivos
- ✅ Formatos permitidos: PDF, JPEG, PNG
- ✅ Tamaño máximo: 5MB
- ✅ Extensiones: .xlsx, .xls, .csv

### Validación de Negocio
- ✅ Coincidencia nombre-cédula con datos oficiales
- ✅ Monto no excede asignado
- ✅ Usuario autenticado y con permisos

## 📦 Archivos de Prueba

### CSV de Staff Oficial (staff_oficial.csv)
Archivo con 20 registros de prueba incluido en el proyecto.

**Estructura**:
```csv
Cedula,Nombre,Correo,Monto
1234567890,Juan Pérez,juan.perez@email.com,450
1122334455,Carlos Rodríguez,carlos.r@email.com,500
...
```

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18.2 + Vite 5
- **Routing**: React Router DOM 6.20
- **Base de Datos**: MongoDB Atlas
- **Driver BD**: MongoDB Driver 6.x
- **Excel**: XLSX 0.18.5
- **Estilos**: CSS3 con variables custom
- **Tipografía**: Google Fonts (Inter)

## 📱 Responsive Design

El sistema es completamente responsive y se adapta a:
- 💻 Desktop (1400px+)
- 💻 Laptop (1024px - 1400px)
- 📱 Tablet (768px - 1024px)
- 📱 Mobile (< 768px)

## 🔐 Seguridad

### Implementado
- ✅ Validación de entradas
- ✅ Gestión de permisos por rol
- ✅ Validación de formatos de archivo
- ✅ Límite de tamaño de archivo

### Recomendaciones para Producción
- ⚠️ Implementar hash de contraseñas (bcrypt)
- ⚠️ Tokens JWT para sesiones
- ⚠️ HTTPS obligatorio
- ⚠️ Rate limiting en login
- ⚠️ Sanitización avanzada de inputs
- ⚠️ Auditoría de todas las acciones

## 📈 Mejoras Futuras

- [ ] Tests unitarios con Jest
- [ ] Tests de integración
- [ ] Cifrado de contraseñas con bcrypt
- [ ] Sistema de logs avanzado
- [ ] Exportación de reportes a PDF/Excel
- [ ] Dashboard con gráficos
- [ ] Notificaciones en tiempo real
- [ ] Historial de cambios (audit trail)

## 📄 Licencia

Este proyecto es de uso académico para el curso de Análisis y Diseño.

---

**Desarrollado con ❤️ usando React + MongoDB**
