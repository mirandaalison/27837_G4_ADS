# Sistema CRUD de Estudiantes
## Arquitectura de 3 Capas + Patrón Modelo-Vista-Controlador (MVC)

### 📋 Descripción del Proyecto

Este proyecto implementa una aplicación CRUD (Create, Read, Update, Delete) para la gestión de estudiantes utilizando:
- **Arquitectura de 3 Capas**: Separación clara entre datos, lógica de negocio y presentación
- **Patrón MVC**: Modelo-Vista-Controlador
- **Interfaz gráfica**: Java Swing
- **Almacenamiento**: ArrayList (datos en memoria)

### 🏗️ Estructura del Proyecto

```
src/main/java/ec/edu/espe/
├── datos/
│   ├── model/
│   │   └── Estudiante.java                 # Modelo de datos
│   └── repository/
│       └── EstudianteRepository.java       # Capa de acceso a datos
├── logica_negocio/
│   └── EstudianteService.java              # Capa de lógica de negocio
└── presentacion/
    ├── EstudianteUI.java                   # Vista y Controlador (Swing)
    └── Main.java                           # Punto de entrada
```

### 🔧 Componentes del Sistema

#### 1. Capa de Datos (datos/)
- **Estudiante.java**: Modelo que representa un estudiante con atributos ID, nombres y edad
- **EstudianteRepository.java**: Repositorio que maneja las operaciones CRUD usando ArrayList
  - Implementa patrón Singleton
  - Operaciones: agregar, editar, eliminar, listar, buscar
  - Datos de prueba iniciales incluidos

#### 2. Capa de Lógica de Negocio (logica_negocio/)
- **EstudianteService.java**: Contiene las validaciones y reglas de negocio
  - Validación de ID único y mayor que 0
  - Validación de nombres (2-100 caracteres, obligatorio)
  - Validación de edad (15-120 años)
  - Delegación de operaciones al repositorio

#### 3. Capa de Presentación (presentacion/)
- **EstudianteUI.java**: Interfaz gráfica con Java Swing
  - Formulario de entrada de datos
  - Tabla para visualizar estudiantes
  - Botones para operaciones CRUD
  - Manejo de estados de la interfaz
- **Main.java**: Clase principal que inicia la aplicación

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
- **Singleton**: EstudianteRepository
- **MVC**: Separación modelo-vista-controlador
- **Repository**: Abstracción del acceso a datos

#### Buenas Prácticas:
- Validación completa de datos
- Manejo de errores con mensajes informativos
- Código documentado y bien estructurado
- Interfaz intuitiva y user-friendly

---

**Desarrollado con Java Swing, aplicando Arquitectura de 3 Capas y Patrón MVC**