/**
 * VISTA - RF12: Búsqueda y Filtrado de Registros
 * Permite buscar y filtrar gastos, comprobantes y pagos con criterios específicos
 */
import { useState } from 'react';
import BusquedaController from '@/controllers/BusquedaController.js';
import './BusquedaRegistros.css';

function BusquedaRegistros() {
  const busquedaController = new BusquedaController();
  
  const [filtros, setFiltros] = useState({
    tipo: 'todos',
    fechaInicio: '',
    fechaFin: '',
    montoMin: '',
    montoMax: '',
    proveedor: '',
    eventoId: '',
    estado: '',
    cedula: ''
  });

  const [resultados, setResultados] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const result = await busquedaController.buscarRegistros(filtros);

    setLoading(false);

    if (result.success) {
      setResultados(result.data);
      setMessage({ 
        type: 'success', 
        text: `Se encontraron ${result.totalResultados} registros` 
      });
    } else {
      setMessage({ type: 'error', text: result.message });
      setResultados(null);
    }
  };

  const handleGenerarReporte = async () => {
    setLoading(true);
    
    const result = await busquedaController.generarReporteAuditoria(filtros);
    
    setLoading(false);

    if (result.success) {
      setMessage({ 
        type: 'success', 
        text: 'Reporte generado correctamente' 
      });
      console.log('Reporte de Auditoría:', result.data);
      // Aquí podrías implementar descarga del reporte
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      tipo: 'todos',
      fechaInicio: '',
      fechaFin: '',
      montoMin: '',
      montoMax: '',
      proveedor: '',
      eventoId: '',
      estado: '',
      cedula: ''
    });
    setResultados(null);
    setMessage({ type: '', text: '' });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="busqueda-container">
      <div className="busqueda-header">
        <h1>Búsqueda y Filtrado de Registros</h1>
        <p>RF12: Sistema de auditoría y revisión financiera</p>
      </div>

      <div className="busqueda-content">
        <div className="filtros-section">
          <h2>Filtros de Búsqueda</h2>
          <form onSubmit={handleBuscar} className="filtros-form">
            <div className="form-group">
              <label htmlFor="tipo">Tipo de Registro</label>
              <select 
                id="tipo" 
                name="tipo" 
                value={filtros.tipo}
                onChange={handleInputChange}
              >
                <option value="todos">Todos los registros</option>
                <option value="comprobantes">Comprobantes</option>
                <option value="gastos">Gastos Operativos</option>
                <option value="pagos">Pagos Excepcionales</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fechaInicio">Fecha Inicio</label>
                <input
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  value={filtros.fechaInicio}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="fechaFin">Fecha Fin</label>
                <input
                  type="date"
                  id="fechaFin"
                  name="fechaFin"
                  value={filtros.fechaFin}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="montoMin">Monto Mínimo ($)</label>
                <input
                  type="number"
                  id="montoMin"
                  name="montoMin"
                  value={filtros.montoMin}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="montoMax">Monto Máximo ($)</label>
                <input
                  type="number"
                  id="montoMax"
                  name="montoMax"
                  value={filtros.montoMax}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="proveedor">Proveedor</label>
              <input
                type="text"
                id="proveedor"
                name="proveedor"
                value={filtros.proveedor}
                onChange={handleInputChange}
                placeholder="Buscar por nombre de proveedor..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="eventoId">Evento/ID</label>
                <input
                  type="text"
                  id="eventoId"
                  name="eventoId"
                  value={filtros.eventoId}
                  onChange={handleInputChange}
                  placeholder="ID del evento"
                />
              </div>

              <div className="form-group">
                <label htmlFor="cedula">Cédula Staff</label>
                <input
                  type="text"
                  id="cedula"
                  name="cedula"
                  value={filtros.cedula}
                  onChange={handleInputChange}
                  placeholder="1234567890"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="estado">Estado</label>
              <select 
                id="estado" 
                name="estado" 
                value={filtros.estado}
                onChange={handleInputChange}
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="aprobado">Aprobado</option>
                <option value="rechazado">Rechazado</option>
                <option value="registrado">Registrado</option>
                <option value="verificado">Verificado</option>
              </select>
            </div>

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="button-group">
              <button type="submit" className="btn-buscar" disabled={loading}>
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
              <button 
                type="button" 
                className="btn-reporte" 
                onClick={handleGenerarReporte}
                disabled={loading}
              >
                Generar Reporte
              </button>
              <button 
                type="button" 
                className="btn-limpiar" 
                onClick={limpiarFiltros}
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>

        <div className="resultados-section">
          <h2>Resultados de la Búsqueda</h2>
          
          {!resultados ? (
            <p className="no-resultados">
              Configura los filtros y presiona "Buscar" para ver resultados
            </p>
          ) : (
            <div className="resultados-container">
              {/* Comprobantes */}
              {resultados.comprobantes && resultados.comprobantes.length > 0 && (
                <div className="resultado-categoria">
                  <h3>Comprobantes ({resultados.comprobantes.length})</h3>
                  {resultados.comprobantes.map(item => (
                    <div key={item._id} className="resultado-card">
                      <div className="resultado-header">
                        <span className="tipo-badge comprobante">Comprobante</span>
                        <span className={`estado-badge ${item.estado}`}>{item.estado}</span>
                      </div>
                      <p><strong>N°:</strong> {item.numeroComprobante}</p>
                      <p><strong>Staff:</strong> {item.staffNombre} ({item.staffCedula})</p>
                      <p><strong>Proveedor:</strong> {item.proveedor}</p>
                      <p><strong>Monto:</strong> ${parseFloat(item.monto || 0).toFixed(2)}</p>
                      <p><strong>Fecha:</strong> {formatDate(item.fechaRegistro)}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Gastos Operativos */}
              {resultados.gastos && resultados.gastos.length > 0 && (
                <div className="resultado-categoria">
                  <h3>Gastos Operativos ({resultados.gastos.length})</h3>
                  {resultados.gastos.map(item => (
                    <div key={item._id} className="resultado-card">
                      <div className="resultado-header">
                        <span className="tipo-badge gasto">Gasto</span>
                        <span className={`estado-badge ${item.estado}`}>{item.estado}</span>
                      </div>
                      <p><strong>N°:</strong> {item.numeroComprobante}</p>
                      <p><strong>Evento:</strong> {item.eventoId}</p>
                      <p><strong>Proveedor:</strong> {item.proveedor}</p>
                      <p><strong>Monto:</strong> ${parseFloat(item.monto || 0).toFixed(2)}</p>
                      <p><strong>Registrado por:</strong> {item.usuarioRegistroNombre}</p>
                      <p><strong>Fecha:</strong> {formatDate(item.fechaRegistro)}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagos Excepcionales */}
              {resultados.pagos && resultados.pagos.length > 0 && (
                <div className="resultado-categoria">
                  <h3>Pagos Excepcionales ({resultados.pagos.length})</h3>
                  {resultados.pagos.map(item => (
                    <div key={item._id} className="resultado-card">
                      <div className="resultado-header">
                        <span className="tipo-badge pago">Pago</span>
                        <span className={`estado-badge ${item.estado}`}>{item.estado}</span>
                      </div>
                      <p><strong>Staff:</strong> {item.staffNombre} ({item.staffCedula})</p>
                      <p><strong>Concepto:</strong> {item.concepto}</p>
                      <p><strong>Monto:</strong> ${parseFloat(item.monto || 0).toFixed(2)}</p>
                      <p><strong>Contadora:</strong> {item.contadoraNombre}</p>
                      <p><strong>Fecha:</strong> {formatDate(item.fechaPago)}</p>
                    </div>
                  ))}
                </div>
              )}

              {resultados.comprobantes?.length === 0 && 
               resultados.gastos?.length === 0 && 
               resultados.pagos?.length === 0 && (
                <p className="no-resultados">
                  No se encontraron registros con los filtros especificados
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BusquedaRegistros;
