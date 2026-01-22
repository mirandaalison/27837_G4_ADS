##  Resumen de Pruebas Unitarias Implementadas

| Tipo de Prueba | ¿Qué se prueba? | ¿Cómo se prueba? | ¿Para qué sirve? | ¿Dónde se ejecuta? | Estado Actual |
|----------------|-----------------|------------------|------------------|--------------------|---------------|
| Pruebas de Modelos | Lógica de negocio, validaciones, cálculos y reglas de datos (Models) | Vitest + mocks de datos, pruebas unitarias puras | Garantizar que la lógica del dominio funciona correctamente | `src/models/__tests__/` | ✅ Implementado (2/5 modelos) |
| Pruebas Unitarias Puras | Funciones individuales (sin UI ni API real) | Vitest (`describe`, `it`, `expect`) | Detectar errores lógicos temprano | Entorno Node + jsdom | ✅ 21 pruebas activas |
| Pruebas de Cobertura | Statements, branches, lines y functions | `@vitest/coverage-v8` | Medir qué tanto código está validado | Reporte HTML + consola | ✅ 90.19% cobertura |
| Pruebas de Validación de Datos | Entradas inválidas, datos faltantes, errores esperados | Casos positivos y negativos | Evitar datos corruptos y bugs silenciosos | Tests de modelos | ✅ Incluido |
| Pruebas de Controladores | Lógica de endpoints y flujos de negocio | Vitest + mocks (fetch/axios/db) | Asegurar flujos completos sin depender del backend real | `src/controllers/__tests__/` | 🔴 Pendiente (0/6) |
| Pruebas de Componentes React | Renderizado, eventos, formularios y estados de UI | React Testing Library + Vitest | Validar que la UI responde correctamente | `src/components/__tests__/` | 🔴 Pendiente (0/8) |
