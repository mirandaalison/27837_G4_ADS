/**
 * MODELO MVC - Pago Excepcional
 * RF10: Representa pagos manuales registrados por la contadora
 */
class PagoExcepcionalModel {
  constructor(data = {}) {
    this.id = data.id || null;
    this.staffCedula = data.staffCedula || '';
    this.staffNombre = data.staffNombre || '';
    this.monto = data.monto || 0;
    this.concepto = data.concepto || '';
    this.observaciones = data.observaciones || '';
    this.fechaPago = data.fechaPago || new Date();
    this.contadoraId = data.contadoraId || null;
    this.contadoraNombre = data.contadoraNombre || '';
    this.estado = data.estado || 'registrado'; // registrado, verificado
    this.fechaRegistro = data.fechaRegistro || new Date();
  }

  validate() {
    const errors = [];

    if (!this.staffCedula || this.staffCedula.length < 10) {
      errors.push('Cédula del staff es obligatoria');
    }

    if (!this.staffNombre || this.staffNombre.trim().length < 3) {
      errors.push('Nombre del staff es obligatorio');
    }

    if (!this.monto || this.monto <= 0) {
      errors.push('Monto debe ser mayor a 0');
    }

    if (!this.concepto || this.concepto.trim().length < 5) {
      errors.push('Concepto debe tener al menos 5 caracteres');
    }

    if (!this.fechaPago) {
      errors.push('Fecha de pago es obligatoria');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      id: this.id,
      staffCedula: this.staffCedula,
      staffNombre: this.staffNombre,
      monto: this.monto,
      concepto: this.concepto,
      observaciones: this.observaciones,
      fechaPago: this.fechaPago,
      contadoraId: this.contadoraId,
      contadoraNombre: this.contadoraNombre,
      estado: this.estado,
      fechaRegistro: this.fechaRegistro
    };
  }
}

export default PagoExcepcionalModel;
