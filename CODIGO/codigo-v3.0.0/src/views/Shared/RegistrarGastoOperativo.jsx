/**
 * VISTA - RF11: Registrar Gasto Operativo
 * Permite registrar gastos operativos con comprobantes
 */
import { useState, useEffect } from 'react';
import GastoOperativoController from '@/controllers/GastoOperativoController.js';
import './RegistrarGastoOperativo.css';

function RegistrarGastoOperativo() {
  const gastoController = new GastoOperativoController();
  
  const [formData, setFormData] = useState({
    numeroComprobante: '',
    fecha: new Date().toISOString().split('T')[0],
    eventoId: '',
    monto: '',
    proveedor: '',
    descripcion: ''
  });

  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedGastoId, setSelectedGastoId] = useState(null);

  useEffect(() => {
    cargarGastos();
  }, []);

  const cargarGastos = async () => {
    const result = await gastoController.obtenerGastos();
    if (result.success) {
      setGastos(result.data);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const result = await gastoController.registrarGasto({
      ...formData,
      monto: parseFloat(formData.monto),
      usuarioRegistroId: currentUser?.id,
      usuarioRegistroNombre: currentUser?.name,
      usuarioRegistroRol: currentUser?.role
    });

    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setFormData({
        numeroComprobante: '',
        fecha: new Date().toISOString().split('T')[0],
        eventoId: '',
        monto: '',
        proveedor: '',
        descripcion: ''
      });
      cargarGastos();
      setSelectedGastoId(result.data.id);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const handleFileUpload = async (gastoId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingDoc(true);
    setMessage({ type: '', text: '' });

    const result = await gastoController.subirDocumento(gastoId, file);

    setUploadingDoc(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      cargarGastos();
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="gasto-operativo-container">
      <div className="gasto-operativo-header">
        <h1>📝 Registrar Gasto Operativo</h1>
        <p>RF11: Control financiero organizado y verificable</p>
      </div>

      <div className="gasto-operativo-content">
        <div className="form-section">
          <form onSubmit={handleSubmit} className="gasto-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="numeroComprobante">Número de Comprobante *</label>
                <input
                  type="text"
                  id="numeroComprobante"
                  name="numeroComprobante"
                  value={formData.numeroComprobante}
                  onChange={handleInputChange}
                  placeholder="001-001-000001234"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="eventoId">Evento/ID *</label>
                <input
                  type="text"
                  id="eventoId"
                  name="eventoId"
                  value={formData.eventoId}
                  onChange={handleInputChange}
                  placeholder="EVENTO-2025-001"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fecha">Fecha *</label>
                <input
                  type="date"
                  id="fecha"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="monto">Monto ($) *</label>
                <input
                  type="number"
                  id="monto"
                  name="monto"
                  value={formData.monto}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="proveedor">Proveedor *</label>
              <input
                type="text"
                id="proveedor"
                name="proveedor"
                value={formData.proveedor}
                onChange={handleInputChange}
                placeholder="Nombre del proveedor"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción *</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Breve descripción del gasto operativo..."
                rows="3"
                required
              />
            </div>

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? '⏳ Registrando...' : '✅ Registrar Gasto'}
            </button>
          </form>
        </div>

        <div className="list-section">
          <h2>📋 Gastos Operativos Registrados</h2>
          <div className="gastos-list">
            {gastos.length === 0 ? (
              <p className="no-data">No hay gastos registrados</p>
            ) : (
              gastos.map(gasto => (
                <div key={gasto._id} className="gasto-card">
                  <div className="gasto-header">
                    <h3>{gasto.numeroComprobante}</h3>
                    <span className={`badge badge-${gasto.estado}`}>
                      {gasto.estado}
                    </span>
                  </div>
                  <div className="gasto-details">
                    <p><strong>Evento:</strong> {gasto.eventoId}</p>
                    <p><strong>Proveedor:</strong> {gasto.proveedor}</p>
                    <p><strong>Monto:</strong> ${gasto.monto.toFixed(2)}</p>
                    <p><strong>Fecha:</strong> {formatDate(gasto.fecha)}</p>
                    <p><strong>Descripción:</strong> {gasto.descripcion}</p>
                    <p><strong>Registrado por:</strong> {gasto.usuarioRegistroNombre} ({gasto.usuarioRegistroRol})</p>
                    
                    {!gasto.documentoRespaldo ? (
                      <div className="upload-section">
                        <label className="btn-upload">
                          📤 Adjuntar Comprobante
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(gasto._id, e)}
                            disabled={uploadingDoc}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>
                    ) : (
                      <div className="file-info">
                        <span className="file-icon">📄</span>
                        <span className="file-name">{gasto.documentoNombre}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrarGastoOperativo;
