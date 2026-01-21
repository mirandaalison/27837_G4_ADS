/**
 * MODELO MVC - Gasto Operativo
 * RF11: Representa gastos operativos con comprobantes de auditoría
 */
class GastoOperativoModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.numeroComprobante = data.numeroComprobante || '';
    this.fecha = data.fecha || new Date();
    this.eventoId = data.eventoId || '';
    this.monto = data.monto || 0;
    this.proveedor = data.proveedor || '';
    this.descripcion = data.descripcion || '';
    this.documentoRespaldo = data.documentoRespaldo || null; // URL del archivo
    this.documentoNombre = data.documentoNombre || null;
    this.usuarioRegistroId = data.usuarioRegistroId || null;
    this.usuarioRegistroNombre = data.usuarioRegistroNombre || '';
    this.usuarioRegistroRol = data.usuarioRegistroRol || ''; // jefe_ticketera o contadora
    this.estado = data.estado || 'pendiente'; // pendiente, verificado
    this.fechaRegistro = data.fechaRegistro || new Date();
  }

  validate() {
    const errors = [];

    if (!this.numeroComprobante || this.numeroComprobante.trim().length === 0) {
      errors.push('Número de comprobante es obligatorio');
    }

    if (!this.fecha) {
      errors.push('Fecha es obligatoria');
    }

    if (!this.eventoId || this.eventoId.trim().length === 0) {
      errors.push('Evento/ID es obligatorio');
    }

    if (!this.monto || this.monto <= 0) {
      errors.push('Monto debe ser mayor a 0');
    }

    if (!this.proveedor || this.proveedor.trim().length < 3) {
      errors.push('Proveedor es obligatorio');
    }

    if (!this.descripcion || this.descripcion.trim().length < 5) {
      errors.push('Descripción debe tener al menos 5 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      id: this.id,
      numeroComprobante: this.numeroComprobante,
      fecha: this.fecha,
      eventoId: this.eventoId,
      monto: this.monto,
      proveedor: this.proveedor,
      descripcion: this.descripcion,
      documentoRespaldo: this.documentoRespaldo,
      documentoNombre: this.documentoNombre,
      usuarioRegistroId: this.usuarioRegistroId,
      usuarioRegistroNombre: this.usuarioRegistroNombre,
      usuarioRegistroRol: this.usuarioRegistroRol,
      estado: this.estado,
      fechaRegistro: this.fechaRegistro
    };
  }
}

export default GastoOperativoModel;
