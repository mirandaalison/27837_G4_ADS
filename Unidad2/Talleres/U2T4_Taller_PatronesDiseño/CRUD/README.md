# Sistema CRUD de Estudiantes
## Arquitectura de 3 Capas + Patrones de Diseño

### 📋 Descripción del Proyecto

Este proyecto implementa una aplicación CRUD (Create, Read, Update, Delete) para la gestión de estudiantes utilizando:
- **Arquitectura de 3 Capas**: Separación clara entre datos, lógica de negocio y presentación
- **Patrón MVC**: Modelo-Vista-Controlador
- **Patrones de Diseño**: Singleton, Strategy y Observer
- **Interfaz gráfica**: Java Swing
- **Almacenamiento**: ArrayList (datos en memoria)

### 🏗️ Estructura del Proyecto

```
src/main/java/ec/edu/espe/
├── datos/
│   ├── model/
│   │   └── Estudiante.java                 # Modelo de datos
│   └── repository/
│       ├── EstudianteRepository.java       # Repositorio principal
│       ├── strategy/                       # Patrón Strategy
│       │   ├── IBusquedaStrategy.java      # Interfaz de estrategia
│       │   ├── BusquedaPorNombre.java      # Estrategia por nombre
│       │   ├── BusquedaPorEdad.java        # Estrategia por edad
│       │   └── BusquedaPorId.java          # Estrategia por ID
│       └── observer/                       # Patrón Observer
│           ├── IRepositoryObserver.java    # Interfaz de observador
│           ├── LogObserver.java            # Observador de logging
│           └── EstadisticasObserver.java   # Observador de estadísticas
├── logica_negocio/
│   └── EstudianteService.java              # Capa de lógica de negocio
└── presentacion/
    ├── EstudianteUI.java                   # Vista y Controlador (Swing)
    └── Main.java                           # Punto de entrada
```

### 🎯 Patrones de Diseño Implementados

#### 1. Singleton Pattern
- **Clases**: EstudianteRepository, EstudianteService, EstudianteUI
- **Propósito**: Garantizar una única instancia de cada componente clave
- **Beneficio**: Control centralizado y consistencia en el estado

#### 2. Strategy Pattern ⭐ NUEVO
- **Ubicación**: `repository/strategy/`
- **Propósito**: Intercambiar algoritmos de búsqueda en tiempo de ejecución
- **Estrategias disponibles**:
  - **BusquedaPorNombre**: Búsqueda por coincidencia parcial en nombres
  - **BusquedaPorEdad**: Búsqueda por edad exacta o rango (ej: "18-25")
  - **BusquedaPorId**: Búsqueda por identificador específico
- **Beneficio**: Flexibilidad para agregar nuevos tipos de búsqueda sin modificar código existente

#### 3. Observer Pattern ⭐ NUEVO
- **Ubicación**: `repository/observer/`
- **Propósito**: Notificar automáticamente cambios en el repositorio
- **Observadores implementados**:
  - **LogObserver**: Registra todas las operaciones con timestamp
  - **EstadisticasObserver**: Mantiene contadores de operaciones realizadas
- **Beneficio**: Logging automático y estadísticas sin código adicional en operaciones CRUD

### 🔧 Componentes del Sistema

#### 1. Capa de Datos (datos/)
- **Estudiante.java**: Modelo que representa un estudiante con atributos ID, nombres y edad
- **EstudianteRepository.java**: Repositorio mejorado con múltiples patrones
  - ✅ **Singleton**: Una única instancia
  - ✅ **Strategy**: Búsquedas flexibles
  - ✅ **Observer**: Notificaciones automáticas
  - Operaciones CRUD completas
  - Nuevos métodos de búsqueda avanzada

#### 2. Capa de Lógica de Negocio (logica_negocio/)
- **EstudianteService.java**: Contiene las validaciones y reglas de negocio
  - Implementa Singleton
  - Validaciones completas de datos
  - Delegación inteligente al repositorio

#### 3. Capa de Presentación (presentacion/)
- **EstudianteUI.java**: Interfaz gráfica mejorada
  - Implementa Singleton
  - Formularios y tabla interactiva
  - Gestión completa de estados
- **Main.java**: Demostración de patrones + punto de entrada

### 🚀 Nuevas Funcionalidades

#### 🔍 Búsquedas Avanzadas (Strategy Pattern):
```java
// Búsqueda por nombre
List<Estudiante> porNombre = repo.buscarPorNombre("juan");

// Búsqueda por edad exacta
List<Estudiante> edad20 = repo.buscarPorEdad("20");

// Búsqueda por rango de edad
List<Estudiante> jovenes = repo.buscarPorEdad("18-25");

// Cambio dinámico de estrategia
repo.cambiarEstrategiaBusqueda(new BusquedaPorId());
List<Estudiante> porId = repo.buscarConEstrategia("1");
```

#### 👁️ Monitoreo Automático (Observer Pattern):
```
[LOG] 26/11/2025 14:30:15 - AGREGADO: Estudiante{id=4, nombres='Ana López', edad=21}
[ESTADÍSTICAS] Estudiantes agregados: 1
[LOG] 26/11/2025 14:31:20 - EDITADO:
    Anterior: Estudiante{id=4, nombres='Ana López', edad=21}
    Nuevo: Estudiante{id=4, nombres='Ana García', edad=22}
[ESTADÍSTICAS] Estudiantes editados: 1
```

### 🚀 Compilación y Ejecución

#### Compilar el proyecto:
```bash
cd CRUD
mkdir out
javac -d out -cp out src/main/java/ec/edu/espe/datos/model/*.java src/main/java/ec/edu/espe/datos/repository/*.java src/main/java/ec/edu/espe/logica_negocio/*.java src/main/java/ec/edu/espe/presentacion/*.java
```

#### Ejecutar la aplicación:
```bash
cd out
java ec.edu.espe.presentacion.Main
```

### 📱 Funcionalidades de la Interfaz

#### Botones disponibles:
- **Nuevo**: Prepara el formulario para agregar un nuevo estudiante
- **Guardar**: Guarda un nuevo estudiante o actualiza uno existente
- **Editar**: Permite modificar el estudiante seleccionado en la tabla
- **Eliminar**: Borra el estudiante seleccionado (con confirmación)
- **Limpiar**: Limpia todos los campos del formulario

#### Características de la tabla:
- Muestra todos los estudiantes con ID, nombres y edad
- Selección de fila para operaciones de edición y eliminación
- Actualización automática después de cada operación

### 🔒 Validaciones Implementadas

#### Validaciones del ID:
- Debe ser mayor que 0
- Debe ser único en el sistema
- Se genera automáticamente para nuevos estudiantes

#### Validaciones de Nombres:
- Campo obligatorio
- Mínimo 2 caracteres
- Máximo 100 caracteres

#### Validaciones de Edad:
- Debe ser mayor que 0
- Mínimo 15 años (edad universitaria)
- Máximo 120 años

### 🏛️ Arquitectura de 3 Capas

#### 1. Capa de Presentación
- **Responsabilidad**: Interfaz de usuario y manejo de eventos
- **Tecnología**: Java Swing
- **Comunicación**: Se comunica solo con la capa de lógica de negocio

#### 2. Capa de Lógica de Negocio
- **Responsabilidad**: Validaciones, reglas de negocio y coordinación
- **Comunicación**: Recibe peticiones de la presentación y las delega a la capa de datos

#### 3. Capa de Datos
- **Responsabilidad**: Almacenamiento y recuperación de datos
- **Tecnología**: ArrayList (memoria)
- **Patrones**: Singleton para garantizar una única instancia

### 🎯 Patrón MVC Implementado

#### Modelo (Model)
- Clase `Estudiante`: Representa los datos
- Sin lógica de negocio ni presentación

#### Vista (View)
- Interfaz gráfica en `EstudianteUI`
- Campos de entrada, botones y tabla
- No contiene lógica de negocio

#### Controlador (Controller)
- Eventos de botones en `EstudianteUI`
- Coordina entre vista y modelo
- Llama a los servicios de negocio

### 📊 Flujo de Operaciones

1. **Usuario interactúa** con la interfaz (EstudianteUI)
2. **Controlador captura** el evento y valida entrada
3. **Servicio aplica** reglas de negocio y validaciones
4. **Repositorio ejecuta** la operación CRUD
5. **Vista se actualiza** con los resultados

### 🔧 Datos Iniciales

El sistema incluye tres estudiantes de prueba:
- Juan Pérez (ID: 1, Edad: 20)
- María González (ID: 2, Edad: 22)  
- Carlos López (ID: 3, Edad: 19)

### ✅ Cumplimiento de Requerimientos

#### ✅ Estructura del Proyecto (5 puntos)
- Arquitectura de 3 capas implementada correctamente
- Paquetes organizados según especificación
- Separación clara de responsabilidades

#### ✅ Modelo, Servicio y Repositorio (5 puntos)
- Clase Estudiante con atributos requeridos
- EstudianteService con validaciones completas
- EstudianteRepository con operaciones CRUD
- Patrón Singleton implementado

#### ✅ Interfaz Gráfica Swing (5 puntos)
- Formulario funcional con campos ID, nombres, edad
- Tabla mostrando todos los estudiantes
- Botones CRUD completamente operativos
- Manejo de estados de la interfaz

#### ✅ Funcionalidad CRUD Completa (5 puntos)
- Create: Agregar nuevos estudiantes con validaciones
- Read: Visualizar lista completa en tabla
- Update: Editar estudiantes existentes
- Delete: Eliminar con confirmación

### 🎓 Aspectos Educativos Destacados

#### Principios SOLID:
- **SRP**: Cada clase tiene una responsabilidad única
- **OCP**: Extensible sin modificar código existente
- **DIP**: Dependencias hacia abstracciones

#### Patrones de Diseño:
- **Singleton**: EstudianteRepository, EstudianteService, EstudianteUI
- **Strategy**: Algoritmos de búsqueda intercambiables
- **Observer**: Sistema de notificaciones automático
- **MVC**: Separación modelo-vista-controlador
- **Repository**: Abstracción del acceso a datos

#### Buenas Prácticas:
- Validación completa de datos
- Manejo de errores con mensajes informativos
- Código documentado y bien estructurado
- Interfaz intuitiva y user-friendly

---

**📁 Documentación Completa**: Ver `DOCUMENTACION_PATRONES.md` para análisis detallado del antes y después de la implementación.

**🎓 Desarrollado con Java Swing, Arquitectura de 3 Capas y Patrones de Diseño (Singleton, Strategy, Observer)**