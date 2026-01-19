# PERFIL DEL PROYECTO – Kairos Mix

## Información General

- **Nombre del Proyecto:** Kairos Mix  
- **Cliente:** Tienda de frutos secos *“Kairos de Dios”*  
- **Tipo de Proyecto:** Sistema Web (MVP)

---

## Resumen Ejecutivo

**Kairos Mix** es un sistema web diseñado para digitalizar y optimizar los procesos operativos de una tienda de frutos secos, reemplazando actividades manuales por un sistema automatizado. El proyecto busca mejorar la eficiencia operativa, el control del negocio y ofrecer un diferenciador competitivo mediante la personalización de mezclas de productos con cálculo nutricional automático.

---

## Contexto del Negocio

- **Tipo de Negocio:** Tienda de frutos secos  
- **Nombre Comercial:** *Kairos de Dios*

### Problemática Actual

- Procesos de venta realizados de forma manual  
- Gestión ineficiente del inventario  
- Falta de control y seguimiento de pedidos  
- Ausencia de herramientas para personalización de productos  

### Solución Propuesta

Desarrollo de un sistema web que digitaliza los procesos principales del negocio e incorpora una funcionalidad innovadora para el diseño de mezclas personalizadas, incluyendo el cálculo automático de valores nutricionales y precios.

---

## Objetivos del Proyecto

### Objetivos Principales

- Digitalizar los procesos de venta y gestión del negocio  
- Implementar un sistema automatizado de control de inventario  
- Desarrollar una funcionalidad para la creación de mezclas personalizadas  
- Proporcionar análisis nutricional en tiempo real  
- Generar reportes de ventas y operaciones del sistema  

---

## Alcance del Proyecto

### Incluye

- Gestión de productos (CRUD)  
- Gestión de clientes  
- Gestión de pedidos con control de estados  
- Diseñador de mezclas personalizadas  
- Cálculo nutricional automático  
- Generación de reportes de ventas  
- Sistema de autenticación de usuarios  

### No Incluye (Fuera del MVP)

- Pasarela de pagos en línea  
- Aplicación móvil nativa  
- Sistema de delivery en tiempo real  
- Integración con sistemas ERP externos  

---

## Stakeholders

### Cliente

- Propietario de la tienda *“Kairos de Dios”*

### Equipo de Desarrollo

- Caetano Flores  
- Jordan Guaman  
- Anthony Morales  
- Leonardo Narváez  

### Usuarios Finales

- **Propietario:** Gestión completa del sistema  
- **Clientes:** Diseño de mezclas personalizadas y consulta de pedidos  

---

## Stack Tecnológico

### Frontend

- React  
- Bootstrap  

### Backend

- Node.js (JavaScript)

### Base de Datos

- MySQL  

### APIs Externas

- Google Maps API (Geolocalización)

---

## Arquitectura del Sistema

- **Tipo de Arquitectura:** Multi-capa (Tres capas)

### Capas

1. **Capa de Presentación**  
2. **Capa de Lógica de Negocio**  
3. **Capa de Persistencia**

### Patrones de Diseño

- MVC (Modelo – Vista – Controlador)  
- Observer (para logging y seguridad)

---

## Estándar de Documentación

- **Diseño de Software:** IEEE Std 1016-2009  

### Viewpoints Aplicados

- Vista Lógica (Diagramas de Clases)  
- Vista de Interacción (Diagramas de Secuencia)  
- Vista de Información (Diagrama Entidad-Relación)  
- Vista Dinámica de Estados  

---

## Funcionalidades Clave

### KM_Gestionar Productos

- CRUD completo para la administración del inventario de frutos secos.

### KM_Gestionar Clientes

- Registro y consulta de información de compradores.

### KM_Gestionar Pedidos

- Control de ventas mediante estados: *por preparar*, *preparado*, *entregado*.

### KM_Diseñar Mezcla Personalizada

Funcionalidad diferenciadora del sistema que permite:

- Selección de ingredientes  
- Definición de proporciones  
- Cálculo automático del precio total  
- Cálculo automático de valores nutricionales  

---

## Métricas de Éxito

- Reducción del tiempo de procesamiento de pedidos  
- Incremento en las ventas de mezclas personalizadas  
- Mejora en el control del inventario  
- Aumento de la satisfacción del cliente mediante la información nutricional  

