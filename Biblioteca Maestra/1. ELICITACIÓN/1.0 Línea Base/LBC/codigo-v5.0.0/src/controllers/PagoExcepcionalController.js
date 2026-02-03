/**
 * CONTROLADOR MVC - RF10: Pagos Excepcionales
 * Gestiona el registro de pagos manuales por la contadora
 */
import PagoExcepcionalModel from '@/models/PagoExcepcionalModel.js';
import { NotificationSystem } from '@/patterns/Observer/NotificationSystem.js';
import api from '@/config/api.js';

class PagoExcepcionalController {
  constructor() {
    this.notificationSystem = NotificationSystem.getInstance();
  }

  /**
   * RF10: Registrar pago excepcional (manual)
   * @param {Object} pagoData - Datos del pago excepcional
   * @returns {Object} - Resultado del registro
   */
  async registrarPagoExcepcional(pagoData) {
    try {
      // Crear modelo de pago excepcional
      const pago = new PagoExcepcionalModel({
        ...pagoData,
        fechaRegistro: new Date(),
        estado: 'registrado'
      });

      // Validar datos
      const validation = pago.validate();
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
      const result = await api.createPagoExcepcional(pago.toJSON());
      pago.id = result.data._id;

      this.notificationSystem.success('Pago excepcional registrado correctamente');

      return {
        success: true,
        message: 'Pago excepcional registrado correctamente',
        data: pago.toJSON()
      };

    } catch (error) {
      this.notificationSystem.error('Error al registrar pago excepcional', { 
        error: error.message 
      });
      return {
        success: false,
        message: `Error al registrar pago excepcional: ${error.message}`,
        data: null
      };
    }
  }

  /**
   * Obtener todos los pagos excepcionales
   * @returns {Array} - Lista de pagos
   */
  async obtenerPagos() {
    try {
      const db = await this.dbConnection.connect();
      const collection = db.collection(this.collectionName);
      
      const pagos = await collection.find({}).sort({ fechaRegistro: -1 }).toArray();
      
      return {
        success: true,
        data: pagos
      };
    } catch (error) {
      this.notificationSystem.error('Error al obtener pagos', { error: error.message });
      return {
        success: false,
        message: `Error al obtener pagos: ${error.message}`,
        data: []
      };
    }
  }

  /**
   * Verificar un pago excepcional
   * @param {string} pagoId - ID del pago
   * @returns {Object} - Resultado de la verificación
   */
  async verificarPago(pagoId) {
    try {
      const db = await this.dbConnection.connect();
      const collection = db.collection(this.collectionName);
      const { ObjectId } = await import('mongodb');

      const result = await collection.updateOne(
        { _id: new ObjectId(pagoId) },
        { $set: { estado: 'verificado', fechaVerificacion: new Date() } }
      );

      if (result.matchedCount === 0) {
        return {
          success: false,
          message: 'Pago no encontrado'
        };
      }

      this.notificationSystem.success('Pago verificado correctamente');

      return {
        success: true,
        message: 'Pago verificado correctamente'
      };
    } catch (error) {
      this.notificationSystem.error('Error al verificar pago', { error: error.message });
      return {
        success: false,
        message: `Error al verificar pago: ${error.message}`
      };
    }
  }
}

export default PagoExcepcionalController;
