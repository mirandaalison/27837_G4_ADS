/**
 * CONTROLADORES GLOBALES
 * Instancias compartidas de controladores para mantener el estado entre componentes
 */
import StaffController from './StaffController.js';
import ComprobanteController from './ComprobanteController.js';
import PagoExcepcionalController from './PagoExcepcionalController.js';
import GastoOperativoController from './GastoOperativoController.js';
import BusquedaController from './BusquedaController.js';

// Instancia única de StaffController para compartir datos del staff
const staffController = new StaffController();

// Instancia única de ComprobanteController vinculada al StaffController
const comprobanteController = new ComprobanteController(staffController);

// Instancia única de PagoExcepcionalController
const pagoExcepcionalController = new PagoExcepcionalController();

// Instancia única de GastoOperativoController
const gastoOperativoController = new GastoOperativoController();

// Instancia única de BusquedaController
const busquedaController = new BusquedaController();

export { 
  staffController, 
  comprobanteController, 
  pagoExcepcionalController,
  gastoOperativoController,
  busquedaController
};
