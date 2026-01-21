/**
 * CONTROLADOR MVC - RF02: Importación de Excel del Staff
 * Gestiona la carga y procesamiento del archivo Excel con datos oficiales
 */
import * as XLSX from 'xlsx';
import StaffMemberModel from '@/models/StaffMemberModel.js';
import { NotificationSystem } from '@/patterns/Observer/NotificationSystem.js';
import api from '@/config/api.js';

class StaffController {
  constructor() {
    this.notificationSystem = NotificationSystem.getInstance();
  }

  /**
   * RF02: Cargar archivo Excel con datos oficiales del staff
   * @param {File} file - Archivo Excel
   * @param {string} eventoNombre - Nombre del evento
   * @returns {Object} - Resultado del procesamiento
   */
  async importarExcel(file, eventoNombre = 'Evento Principal') {
    try {
      // Validar que se haya seleccionado un archivo
      if (!file) {
        this.notificationSystem.error('No se seleccionó ningún archivo');
        return {
          success: false,
          message: 'No se seleccionó ningún archivo',
          data: null
        };
      }

      // Validar extensión del archivo
      const validExtensions = ['.xlsx', '.xls', '.csv'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      
      if (!validExtensions.includes(fileExtension)) {
        this.notificationSystem.error('Formato de archivo no válido. Use Excel (.xlsx, .xls) o CSV');
        return {
          success: false,
          message: 'Formato de archivo no válido',
          data: null
        };
      }

      // Leer el archivo
      const data = await this.readExcelFile(file);

      // Validar estructura del archivo
      const validationResult = this.validateExcelStructure(data);
      if (!validationResult.isValid) {
        this.notificationSystem.error(
          'Formato de archivo no válido',
          { errors: validationResult.errors }
        );
        return {
          success: false,
          message: 'Formato de archivo no válido',
          errors: validationResult.errors,
          data: null
        };
      }

      // Procesar y validar cada registro
      const processedRecords = [];
      const errors = [];
      const eventoId = Date.now(); // Simular ID de evento

      data.forEach((row, index) => {
        try {
          const staffMember = new StaffMemberModel({
            id: Date.now() + index,
            cedula: String(row.cedula || row.Cedula || '').trim(),
            nombre: String(row.nombre || row.Nombre || '').trim(),
            correo: String(row.correo || row.Correo || row.email || '').trim(),
            montoAsignado: parseFloat(row.monto || row.Monto || row.montoAsignado || 0),
            eventoId: eventoId,
            eventoNombre: eventoNombre,
            fechaCarga: new Date()
          });

          // Validar el registro
          const validation = staffMember.validate();
          if (validation.isValid) {
            processedRecords.push(staffMember);
          } else {
            errors.push({
              fila: index + 2, // +2 porque Excel empieza en 1 y hay encabezado
              errores: validation.errors
            });
          }
        } catch (error) {
          errors.push({
            fila: index + 2,
            errores: [`Error al procesar: ${error.message}`]
          });
        }
      });

      // Verificar si hay registros válidos
      if (processedRecords.length === 0) {
        this.notificationSystem.error('No se pudo procesar ningún registro válido');
        return {
          success: false,
          message: 'No se pudo procesar ningún registro válido',
          errors: errors,
          data: null
        };
      }

      // Guardar en MongoDB a través del backend
      const recordsToInsert = processedRecords.map(r => r.toJSON());
      const result = await api.importStaff(recordsToInsert);

      // Notificar éxito
      const message = `Datos del staff cargados correctamente. ${result.insertedCount} registros procesados`;
      this.notificationSystem.success(message, {
        total: processedRecords.length,
        errores: errors.length
      });

      return {
        success: true,
        message: message,
        data: {
          registrosProcesados: processedRecords.length,
          registrosConError: errors.length,
          errores: errors,
          registros: processedRecords.map(r => r.toJSON())
        }
      };

    } catch (error) {
      this.notificationSystem.error('Error al procesar el archivo', { error: error.message });
      return {
        success: false,
        message: `Error al procesar el archivo: ${error.message}`,
        data: null
      };
    }
  }

  /**
   * Leer archivo Excel
   */
  async readExcelFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet);
          resolve(jsonData);
        } catch (error) {
          reject(new Error('Error al leer el archivo Excel'));
        }
      };

      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Validar estructura del Excel
   */
  validateExcelStructure(data) {
    const errors = [];

    if (!data || data.length === 0) {
      errors.push('El archivo está vacío');
      return { isValid: false, errors };
    }

    // Verificar columnas requeridas (flexible con mayúsculas/minúsculas)
    const firstRow = data[0];
    const keys = Object.keys(firstRow).map(k => k.toLowerCase());

    const requiredColumns = ['cedula', 'nombre', 'correo', 'monto'];
    const missingColumns = requiredColumns.filter(col => 
      !keys.some(key => key.includes(col))
    );

    if (missingColumns.length > 0) {
      errors.push(`Columnas faltantes: ${missingColumns.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Obtener todos los miembros del staff
   */
  async getAllStaffMembers() {
    try {
      const result = await api.getAllStaff();
      return result.data;
    } catch (error) {
      console.error('Error obteniendo staff:', error);
      return [];
    }
  }

  /**
   * Buscar miembro del staff por cédula
   */
  async findStaffByCedula(cedula) {
    try {
      const result = await api.getStaffByCedula(cedula);
      return result.data;
    } catch (error) {
      console.error('Error buscando staff:', error);
      return null;
    }
  }

  /**
   * Limpiar datos del staff (para testing)
   */
  async clearStaffData() {
    try {
      await api.clearStaff();
      console.log('✅ Datos del staff eliminados');
    } catch (error) {
      console.error('Error limpiando datos:', error);
    }
  }
}

export default StaffController;
