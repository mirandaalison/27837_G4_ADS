/**
 * CONFIGURACIÓN DE API
 * Cliente HTTP para comunicación con el backend
 */

const API_BASE_URL = 'http://localhost:5000/api';

class APIClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error en la petición');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Staff Members
  async importStaff(records) {
    return this.request('/staff/import', {
      method: 'POST',
      body: JSON.stringify({ records }),
    });
  }

  async getAllStaff() {
    return this.request('/staff');
  }

  async getStaffByCedula(cedula) {
    return this.request(`/staff/${cedula}`);
  }

  async clearStaff() {
    return this.request('/staff', { method: 'DELETE' });
  }

  // Comprobantes
  async createComprobante(comprobante) {
    return this.request('/comprobantes', {
      method: 'POST',
      body: JSON.stringify(comprobante),
    });
  }

  async getAllComprobantes() {
    return this.request('/comprobantes');
  }

  async getComprobanteById(id) {
    return this.request(`/comprobantes/${id}`);
  }

  async updateComprobante(id, updates) {
    return this.request(`/comprobantes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Pagos Excepcionales
  async createPagoExcepcional(pago) {
    return this.request('/pagos-excepcionales', {
      method: 'POST',
      body: JSON.stringify(pago),
    });
  }

  async getAllPagosExcepcionales() {
    return this.request('/pagos-excepcionales');
  }

  async verificarPagoExcepcional(id) {
    return this.request(`/pagos-excepcionales/${id}/verificar`, {
      method: 'PUT',
    });
  }

  // Gastos Operativos
  async createGastoOperativo(gasto) {
    return this.request('/gastos-operativos', {
      method: 'POST',
      body: JSON.stringify(gasto),
    });
  }

  async getAllGastosOperativos() {
    return this.request('/gastos-operativos');
  }

  async updateGastoOperativo(id, updates) {
    return this.request(`/gastos-operativos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Búsqueda
  async buscar(tipo, query) {
    return this.request('/busqueda', {
      method: 'POST',
      body: JSON.stringify({ tipo, query }),
    });
  }
}

export default new APIClient();
