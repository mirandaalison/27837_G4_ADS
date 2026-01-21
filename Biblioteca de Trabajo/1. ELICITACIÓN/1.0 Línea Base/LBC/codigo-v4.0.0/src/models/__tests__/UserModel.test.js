import { describe, test, expect, beforeEach } from 'vitest';
import UserModel from '../UserModel.js';

describe('UserModel', () => {
  let userData;

  beforeEach(() => {
    userData = {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      cedula: '1234567890',
      password: 'securepass123',
      role: 'staff'
    };
  });

  describe('Constructor', () => {
    test('UT-USER-001: Debe crear un usuario con datos válidos', () => {
      const user = new UserModel(userData);
      
      expect(user.name).toBe('Juan Pérez');
      expect(user.email).toBe('juan@example.com');
      expect(user.cedula).toBe('1234567890');
      expect(user.role).toBe('staff');
      expect(user.createdAt).toBeInstanceOf(Date);
    });

    test('UT-USER-002: Debe crear un usuario con valores por defecto', () => {
      const user = new UserModel();
      
      expect(user.id).toBeNull();
      expect(user.name).toBe('');
      expect(user.email).toBe('');
      expect(user.cedula).toBe('');
      expect(user.password).toBe('');
      expect(user.role).toBe('staff');
    });
  });

  describe('Validación', () => {
    test('UT-USER-003: Debe validar usuario con datos correctos', () => {
      const user = new UserModel(userData);
      const result = user.validate();
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('UT-USER-004: Debe rechazar email inválido', () => {
      userData.email = 'invalidemail';
      const user = new UserModel(userData);
      const result = user.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email inválido');
    });

    test('UT-USER-005: Debe rechazar cédula corta', () => {
      userData.cedula = '123';
      const user = new UserModel(userData);
      const result = user.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Cédula inválida');
    });

    test('UT-USER-006: Debe rechazar contraseña corta', () => {
      userData.password = '123';
      const user = new UserModel(userData);
      const result = user.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Contraseña debe tener al menos 6 caracteres');
    });

    test('UT-USER-007: Debe rechazar rol inválido', () => {
      userData.role = 'admin';
      const user = new UserModel(userData);
      const result = user.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Rol inválido');
    });

    test('UT-USER-008: Debe acumular múltiples errores', () => {
      userData.email = 'invalid';
      userData.cedula = '123';
      userData.password = '12';
      const user = new UserModel(userData);
      const result = user.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
    });
  });

  describe('toJSON', () => {
    test('UT-USER-009: Debe serializar usuario sin password', () => {
      const user = new UserModel(userData);
      const json = user.toJSON();
      
      expect(json).toHaveProperty('name');
      expect(json).toHaveProperty('email');
      expect(json).toHaveProperty('role');
      expect(json).not.toHaveProperty('password');
    });
  });
});
