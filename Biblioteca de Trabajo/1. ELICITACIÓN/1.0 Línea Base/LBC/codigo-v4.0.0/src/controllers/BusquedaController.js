/**
 * CONTROLADOR MVC - RF12: Búsqueda y Filtrado de Registros
 * Permite buscar y filtrar gastos, comprobantes y pagos
 */
import { NotificationSystem } from '@/patterns/Observer/NotificationSystem.js';
import api from '@/config/api.js';

class BusquedaController {
  constructor() {
    this.notificationSystem = NotificationSystem.getInstance();
  }

  /**
   * RF12: Buscar y filtrar registros en múltiples colecciones
   * @param {Object} filtros - Criterios de búsqueda
   * @returns {Object} - Resultados de la búsqueda
   */
  async buscarRegistros(filtros = {}) {
    try {
      const {
        tipo, // 'comprobantes', 'gastos', 'pagos', 'todos'
        fechaInicio,
        fechaFin,
        montoMin,
        montoMax,
        proveedor,
        eventoId,
        estado,
        cedula
      } = filtros;

      const query = this.construirQuery(filtros);
      
      // Usar la API del backend para buscar
      const result = await api.buscar(tipo || 'todos', query);
      const resultados = result.data;

      // Compatibilidad con código existente
      if (tipo === 'comprobantes' || tipo === 'todos') {
        resultados.comprobantes = resultados.comprobantes || [];
      }

      if (tipo === 'gastos' || tipo === 'todos') {
        resultados.gastos = gastos;
      }

      if (tipo === 'pagos' || tipo === 'todos') {
        const pagos = await db.collection('pagos_excepcionales')
          .find(query)
          .sort({ fechaRegistro: -1 })
          .toArray();
        resultados.pagos = pagos;
      }

      const totalResultados = 
        (resultados.comprobantes?.length || 0) +
        (resultados.gastos?.length || 0) +
        (resultados.pagos?.length || 0);

      this.notificationSystem.success(`Se encontraron ${totalResultados} registros`);

      return {
        success: true,
        message: `Se encontraron ${totalResultados} registros`,
        data: resultados,
        totalResultados
      };

    } catch (error) {
      this.notificationSystem.error('Error al buscar registros', { 
        error: error.message 
      });
      return {
        success: false,
        message: `Error al buscar registros: ${error.message}`,
        data: {},
        totalResultados: 0
      };
    }
  }

  /**
   * Construir query de MongoDB según los filtros
   * @param {Object} filtros - Criterios de búsqueda
   * @returns {Object} - Query de MongoDB
   */
  construirQuery(filtros) {
    const query = {};

    // Filtro por rango de fechas
    if (filtros.fechaInicio || filtros.fechaFin) {
      query.fechaRegistro = {};
      if (filtros.fechaInicio) {
        query.fechaRegistro.$gte = new Date(filtros.fechaInicio);
      }
      if (filtros.fechaFin) {
        query.fechaRegistro.$lte = new Date(filtros.fechaFin);
      }
    }

    // Filtro por rango de monto
    if (filtros.montoMin || filtros.montoMax) {
      query.monto = {};
      if (filtros.montoMin) {
        query.monto.$gte = parseFloat(filtros.montoMin);
      }
      if (filtros.montoMax) {
        query.monto.$lte = parseFloat(filtros.montoMax);
      }
    }

    // Filtro por proveedor (búsqueda parcial insensible a mayúsculas)
    if (filtros.proveedor) {
      query.proveedor = { $regex: filtros.proveedor, $options: 'i' };
    }

    // Filtro por evento/ID
    if (filtros.eventoId) {
      query.eventoId = filtros.eventoId;
    }

    // Filtro por estado
    if (filtros.estado) {
      query.estado = filtros.estado;
    }

    // Filtro por cédula del staff
    if (filtros.cedula) {
      query.staffCedula = filtros.cedula;
    }

    return query;
  }

  /**
   * RF12: Generar reporte de auditoría
   * @param {Object} filtros - Criterios del reporte
   * @returns {Object} - Datos del reporte
   */
  async generarReporteAuditoria(filtros = {}) {
    try {
      const resultados = await this.buscarRegistros(filtros);

      if (!resultados.success) {
        return resultados;
      }

      // Calcular estadísticas
      const estadisticas = this.calcularEstadisticas(resultados.data);

      return {
        success: true,
        message: 'Reporte generado correctamente',
        data: {
          registros: resultados.data,
          estadisticas,
          fechaGeneracion: new Date(),
          filtrosAplicados: filtros
        }
      };

    } catch (error) {
      this.notificationSystem.error('Error al generar reporte', { 
        error: error.message 
      });
      return {
        success: false,
        message: `Error al generar reporte: ${error.message}`,
        data: null
      };
    }
  }

  /**
   * Calcular estadísticas de los registros
   * @param {Object} registros - Registros agrupados por tipo
   * @returns {Object} - Estadísticas calculadas
   */
  calcularEstadisticas(registros) {
    const estadisticas = {
      totalComprobantes: registros.comprobantes?.length || 0,
      totalGastos: registros.gastos?.length || 0,
      totalPagos: registros.pagos?.length || 0,
      montoTotalComprobantes: 0,
      montoTotalGastos: 0,
      montoTotalPagos: 0,
      montoTotal: 0
    };

    // Sumar montos de comprobantes
    if (registros.comprobantes) {
      estadisticas.montoTotalComprobantes = registros.comprobantes.reduce(
        (sum, item) => sum + (item.monto || 0), 0
      );
    }

    // Sumar montos de gastos
    if (registros.gastos) {
      estadisticas.montoTotalGastos = registros.gastos.reduce(
        (sum, item) => sum + (item.monto || 0), 0
      );
    }

    // Sumar montos de pagos
    if (registros.pagos) {
      estadisticas.montoTotalPagos = registros.pagos.reduce(
        (sum, item) => sum + (item.monto || 0), 0
      );
    }

    estadisticas.montoTotal = 
      estadisticas.montoTotalComprobantes +
      estadisticas.montoTotalGastos +
      estadisticas.montoTotalPagos;

    return estadisticas;
  }
}

export default BusquedaController;
