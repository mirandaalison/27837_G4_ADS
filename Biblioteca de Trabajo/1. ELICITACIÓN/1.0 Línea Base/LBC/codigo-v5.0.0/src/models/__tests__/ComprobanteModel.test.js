import { describe, test, expect, beforeEach } from 'vitest';
import ComprobanteModel from '../ComprobanteModel.js';

describe('ComprobanteModel', () => {
  let comprobanteData;

  beforeEach(() => {
    comprobanteData = {
      numeroComprobante: 'COMP-001',
      fecha: new Date('2026-01-21'),
      proveedor: 'Proveedor Test',
      monto: 150.50,
      descripcion: 'Compra de materiales para evento',
      staffCedula: '1234567890',
      staffNombre: 'Juan Pérez'
    };
  });

  describe('Constructor', () => {
    test('UT-COMP-001: Debe crear comprobante con datos válidos', () => {
      const comprobante = new ComprobanteModel(comprobanteData);
      
      expect(comprobante.numeroComprobante).toBe('COMP-001');
      expect(comprobante.proveedor).toBe('Proveedor Test');
      expect(comprobante.monto).toBe(150.50);
      expect(comprobante.staffCedula).toBe('1234567890');
      expect(comprobante.estado).toBe('pendiente');
    });

    test('UT-COMP-002: Debe crear comprobante con valores por defecto', () => {
      const comprobante = new ComprobanteModel();
      
      expect(comprobante.id).toBeNull();
      expect(comprobante.numeroComprobante).toBe('');
      expect(comprobante.monto).toBe(0);
      expect(comprobante.estado).toBe('pendiente');
      expect(comprobante.validadoDatosOficiales).toBe(false);
      expect(comprobante.validadoDocumento).toBe(false);
    });
  });

  describe('Validación', () => {
    test('UT-COMP-003: Debe validar comprobante con datos correctos', () => {
      const comprobante = new ComprobanteModel(comprobanteData);
      const result = comprobante.validate();
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('UT-COMP-004: Debe rechazar número de comprobante vacío', () => {
      comprobanteData.numeroComprobante = '';
      const comprobante = new ComprobanteModel(comprobanteData);
      const result = comprobante.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Número de comprobante es obligatorio');
    });

    test('UT-COMP-005: Debe rechazar proveedor inválido', () => {
      comprobanteData.proveedor = 'AB';
      const comprobante = new ComprobanteModel(comprobanteData);
      const result = comprobante.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Proveedor inválido');
    });

    test('UT-COMP-006: Debe rechazar monto cero o negativo', () => {
      comprobanteData.monto = 0;
      const comprobante = new ComprobanteModel(comprobanteData);
      const result = comprobante.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Monto debe ser mayor a 0');
    });

    test('UT-COMP-007: Debe rechazar descripción corta', () => {
      comprobanteData.descripcion = 'ABC';
      const comprobante = new ComprobanteModel(comprobanteData);
      const result = comprobante.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Descripción debe tener al menos 5 caracteres');
    });

    test('UT-COMP-008: Debe rechazar cédula faltante', () => {
      comprobanteData.staffCedula = '';
      const comprobante = new ComprobanteModel(comprobanteData);
      const result = comprobante.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Cédula del staff es obligatoria');
    });

    test('UT-COMP-009: Debe acumular múltiples errores', () => {
      comprobanteData.numeroComprobante = '';
      comprobanteData.monto = -10;
      comprobanteData.proveedor = 'A';
      const comprobante = new ComprobanteModel(comprobanteData);
      const result = comprobante.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(2);
    });
  });

  describe('Estados', () => {
    test('UT-COMP-010: Debe iniciar con estado pendiente', () => {
      const comprobante = new ComprobanteModel(comprobanteData);
      expect(comprobante.estado).toBe('pendiente');
    });

    test('UT-COMP-011: Debe permitir estado aprobado', () => {
      comprobanteData.estado = 'aprobado';
      const comprobante = new ComprobanteModel(comprobanteData);
      expect(comprobante.estado).toBe('aprobado');
    });

    test('UT-COMP-012: Debe permitir estado rechazado', () => {
      comprobanteData.estado = 'rechazado';
      const comprobante = new ComprobanteModel(comprobanteData);
      expect(comprobante.estado).toBe('rechazado');
    });
  });
});
