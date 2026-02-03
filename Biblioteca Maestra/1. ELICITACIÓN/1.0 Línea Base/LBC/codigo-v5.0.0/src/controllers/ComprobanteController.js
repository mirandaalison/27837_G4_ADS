/**
 * CONTROLADOR MVC - RF03, RF04, RF05: Gestión de Comprobantes
 * RF03: Registro de comprobante
 * RF04: Subida de documento
 * RF05: Validación contra datos oficiales
 */
import ComprobanteModel from '@/models/ComprobanteModel.js';
import { NotificationSystem } from '@/patterns/Observer/NotificationSystem.js';
import api from '@/config/api.js';

class ComprobanteController {
  constructor(staffController) {
    this.notificationSystem = NotificationSystem.getInstance();
    this.staffController = staffController;
  }

  /**
   * RF03: Registrar datos básicos de un comprobante
   * @param {Object} comprobanteData - Datos del comprobante
   * @returns {Object} - Resultado del registro
   */
  async registrarComprobante(comprobanteData) {
    try {
      // Crear modelo de comprobante
      const comprobante = new ComprobanteModel({
        ...comprobanteData,
        fechaRegistro: new Date(),
        estado: 'pendiente'
      });

      // Validar datos del comprobante
      const validation = comprobante.validate();
      if (!validation.isValid) {
        this.notificationSystem.error('Complete todos los campos requeridos', {
          errors: validation.errors
        });
        return {
          success: false,
          message: 'Complete todos los campos requeridos',
          errors: validation.errors,
          data: null
        };
      }

      // Insertar a través de la API
      const result = await api.createComprobante(comprobante.toJSON());
      comprobante.id = result.data._id;

      this.notificationSystem.success('Comprobante registrado correctamente');

      return {
        success: true,
        message: 'Comprobante registrado correctamente',
        data: comprobante.toJSON()
      };

    } catch (error) {
      this.notificationSystem.error('Error al registrar comprobante', { error: error.message });
      return {
        success: false,
        message: `Error al registrar comprobante: ${error.message}`,
        data: null
      };
    }
  }

  /**
   * RF04: Subir imagen o PDF del comprobante
   * @param {number} comprobanteId - ID del comprobante
   * @param {File} file - Archivo a subir
   * @returns {Object} - Resultado de la subida
   */
  async subirDocumento(comprobanteId, file) {
    try {
      // Validar archivo
      if (!file) {
        this.notificationSystem.error('No se seleccionó ningún archivo');
        return {
          success: false,
          message: 'No se seleccionó ningún archivo',
          data: null
        };
      }

      // Validar formato y tamaño
      const validationResult = this.validateFile(file);
      if (!validationResult.isValid) {
        this.notificationSystem.error('Archivo no válido', { errors: validationResult.errors });
        return {
          success: false,
          message: 'Archivo no válido',
          errors: validationResult.errors,
          data: null
        };
      }

      // Simular subida de archivo (en producción se subiría a servidor/cloud)
      const fileUrl = await this.uploadFileSimulation(file);

      // Actualizar comprobante con información del archivo
      const result = await api.updateComprobante(comprobanteId, {
        archivoUrl: fileUrl,
        archivoNombre: file.name,
        validadoDocumento: true
      });

      if (result.matchedCount === 0) {
        this.notificationSystem.error('Comprobante no encontrado');
        return {
          success: false,
          message: 'Comprobante no encontrado',
          data: null
        };
      }

      this.notificationSystem.success('Documento subido correctamente');

      return {
        success: true,
        message: 'Documento subido correctamente',
        data: {
          comprobanteId: comprobanteId,
          archivoUrl: fileUrl,
          archivoNombre: file.name
        }
      };

    } catch (error) {
      this.notificationSystem.error('Error al subir documento', { error: error.message });
      return {
        success: false,
        message: `Error al subir documento: ${error.message}`,
        data: null
      };
    }
  }

  /**
   * Validar archivo
   */
  validateFile(file) {
    const errors = [];

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      errors.push('El archivo supera el tamaño máximo permitido (5MB)');
    }

    // Validar formato
    const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validFormats.includes(file.type)) {
      errors.push('Formato no válido. Use JPEG, PNG o PDF');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Simular subida de archivo
   */
  async uploadFileSimulation(file) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular URL de archivo subido
        const timestamp = Date.now();
        const url = `uploads/comprobantes/${timestamp}_${file.name}`;
        resolve(url);
      }, 1000);
    });
  }

  /**
   * RF05: Validar coincidencia del comprobante con datos oficiales del staff
   * @param {number} comprobanteId - ID del comprobante
   * @returns {Object} - Resultado de la validación
   */
  async validarContraDatosOficiales(comprobanteId) {
    try {
      // Llamar al API para validar
      const result = await api.validarComprobante(comprobanteId);

      if (result.success) {
        this.notificationSystem.success('Comprobante validado correctamente contra datos oficiales');
      } else {
        this.notificationSystem.error(result.message);
      }

      return result;

    } catch (error) {
      this.notificationSystem.error('Error al validar comprobante', { error: error.message });
      return {
        success: false,
        message: `Error al validar comprobante: ${error.message}`,
        data: null
      };
    }
  }

  /**
   * Obtener todos los comprobantes
   */
  async getAllComprobantes() {
    try {
      const result = await api.getAllComprobantes();
      return result.data;
    } catch (error) {
      console.error('Error obteniendo comprobantes:', error);
      return [];
    }
  }

  /**
   * Obtener comprobante por ID
   */
  async getComprobanteById(id) {
    try {
      const result = await api.getComprobanteById(id);
      return result.data;
    } catch (error) {
      console.error('Error obteniendo comprobante:', error);
      return null;
    }
  }

  /**
   * Obtener comprobantes por cédula de staff
   */
  getComprobantesByStaff(cedula) {
    return this.comprobantes
      .filter(c => c.staffCedula === cedula)
      .map(c => c.toJSON());
  }

  /**
   * Obtener comprobante por ID
   */
  getComprobanteById(id) {
    const comprobante = this.comprobantes.find(c => c.id === id);
    return comprobante ? comprobante.toJSON() : null;
  }
}

export default ComprobanteController;
