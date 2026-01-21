/**
 * CONTROLADOR MVC - RF11: Gastos Operativos
 * Gestiona el registro de gastos operativos con comprobantes de auditoría
 */
import GastoOperativoModel from '@/models/GastoOperativoModel.js';
import { NotificationSystem } from '@/patterns/Observer/NotificationSystem.js';
import api from '@/config/api.js';

class GastoOperativoController {
  constructor() {
    this.notificationSystem = NotificationSystem.getInstance();
  }

  /**
   * RF11: Registrar gasto operativo con comprobante
   * @param {Object} gastoData - Datos del gasto operativo
   * @returns {Object} - Resultado del registro
   */
  async registrarGasto(gastoData) {
    try {
      // Crear modelo de gasto operativo
      const gasto = new GastoOperativoModel({
        ...gastoData,
        fechaRegistro: new Date(),
        estado: 'pendiente'
      });

      // Validar datos
      const validation = gasto.validate();
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
      const result = await api.createGastoOperativo(gasto.toJSON());
      gasto.id = result.data._id;

      this.notificationSystem.success('Gasto operativo registrado correctamente');

      return {
        success: true,
        message: 'Gasto operativo registrado correctamente',
        data: gasto.toJSON()
      };

    } catch (error) {
      this.notificationSystem.error('Error al registrar gasto operativo', { 
        error: error.message 
      });
      return {
        success: false,
        message: `Error al registrar gasto operativo: ${error.message}`,
        data: null
      };
    }
  }

  /**
   * RF11: Subir documento de respaldo
   * @param {string} gastoId - ID del gasto
   * @param {File} file - Archivo a subir
   * @returns {Object} - Resultado de la subida
   */
  async subirDocumento(gastoId, file) {
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

      // Simular subida de archivo
      const fileUrl = await this.uploadFileSimulation(file);

      // Actualizar registro en MongoDB
      const db = await this.dbConnection.connect();
      const collection = db.collection(this.collectionName);
      const { ObjectId } = await import('mongodb');

      const result = await collection.updateOne(
        { _id: new ObjectId(gastoId) },
        { 
          $set: { 
            documentoRespaldo: fileUrl,
            documentoNombre: file.name
          } 
        }
      );

      if (result.matchedCount === 0) {
        this.notificationSystem.error('Gasto no encontrado');
        return {
          success: false,
          message: 'Gasto no encontrado',
          data: null
        };
      }

      this.notificationSystem.success('Documento subido correctamente');

      return {
        success: true,
        message: 'Documento subido correctamente',
        data: { fileUrl, fileName: file.name }
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
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push('El archivo no debe superar 5MB');
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
        const timestamp = Date.now();
        const url = `uploads/gastos/${timestamp}_${file.name}`;
        resolve(url);
      }, 1000);
    });
  }

  /**
   * Obtener todos los gastos operativos
   * @returns {Array} - Lista de gastos
   */
  async obtenerGastos() {
    try {
      const db = await this.dbConnection.connect();
      const collection = db.collection(this.collectionName);
      
      const gastos = await collection.find({}).sort({ fechaRegistro: -1 }).toArray();
      
      return {
        success: true,
        data: gastos
      };
    } catch (error) {
      this.notificationSystem.error('Error al obtener gastos', { error: error.message });
      return {
        success: false,
        message: `Error al obtener gastos: ${error.message}`,
        data: []
      };
    }
  }

  /**
   * Verificar un gasto operativo
   * @param {string} gastoId - ID del gasto
   * @returns {Object} - Resultado de la verificación
   */
  async verificarGasto(gastoId) {
    try {
      const db = await this.dbConnection.connect();
      const collection = db.collection(this.collectionName);
      const { ObjectId } = await import('mongodb');

      const result = await collection.updateOne(
        { _id: new ObjectId(gastoId) },
        { $set: { estado: 'verificado', fechaVerificacion: new Date() } }
      );

      if (result.matchedCount === 0) {
        return {
          success: false,
          message: 'Gasto no encontrado'
        };
      }

      this.notificationSystem.success('Gasto verificado correctamente');

      return {
        success: true,
        message: 'Gasto verificado correctamente'
      };
    } catch (error) {
      this.notificationSystem.error('Error al verificar gasto', { error: error.message });
      return {
        success: false,
        message: `Error al verificar gasto: ${error.message}`
      };
    }
  }
}

export default GastoOperativoController;
