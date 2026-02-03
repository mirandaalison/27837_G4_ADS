/**
 * VISTA - RF10: Registrar Pago Excepcional
 * Permite a la contadora registrar pagos manuales al staff
 */
import { useState, useEffect } from 'react';
import PagoExcepcionalController from '@/controllers/PagoExcepcionalController.js';
import './RegistrarPagoExcepcional.css';

function RegistrarPagoExcepcional() {
  const pagoController = new PagoExcepcionalController();
  
  const [formData, setFormData] = useState({
    staffCedula: '',
    staffNombre: '',
    monto: '',
    concepto: '',
    observaciones: '',
    fechaPago: new Date().toISOString().split('T')[0]
  });

  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    cargarPagos();
  }, []);

  const cargarPagos = async () => {
    const result = await pagoController.obtenerPagos();
    if (result.success) {
      setPagos(result.data);
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

    // Obtener datos del usuario actual (simulado)
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const result = await pagoController.registrarPagoExcepcional({
      ...formData,
      monto: parseFloat(formData.monto),
      contadoraId: currentUser?.id,
      contadoraNombre: currentUser?.name
    });

    setLoading(false);

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setFormData({
        staffCedula: '',
        staffNombre: '',
        monto: '',
        concepto: '',
        observaciones: '',
        fechaPago: new Date().toISOString().split('T')[0]
      });
      cargarPagos();
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
    <div className="pago-excepcional-container">
      <div className="pago-excepcional-header">
        <h1>Registrar Pago Excepcional</h1>
        <p>RF10: Registro manual de pagos fuera del flujo común</p>
      </div>

      <div className="pago-excepcional-content">
        <div className="form-section">
          <form onSubmit={handleSubmit} className="pago-form">
            <div className="form-group">
              <label htmlFor="staffCedula">Cédula del Staff *</label>
              <input
                type="text"
                id="staffCedula"
                name="staffCedula"
                value={formData.staffCedula}
                onChange={handleInputChange}
                placeholder="1234567890"
                maxLength="10"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="staffNombre">Nombre del Staff *</label>
              <input
                type="text"
                id="staffNombre"
                name="staffNombre"
                value={formData.staffNombre}
                onChange={handleInputChange}
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div className="form-row">
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

              <div className="form-group">
                <label htmlFor="fechaPago">Fecha de Pago *</label>
                <input
                  type="date"
                  id="fechaPago"
                  name="fechaPago"
                  value={formData.fechaPago}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="concepto">Concepto *</label>
              <input
                type="text"
                id="concepto"
                name="concepto"
                value={formData.concepto}
                onChange={handleInputChange}
                placeholder="Pago manual por ajuste de nómina"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="observaciones">Observaciones</label>
              <textarea
                id="observaciones"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                placeholder="Información adicional sobre este pago..."
                rows="3"
              />
            </div>

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar Pago'}
            </button>
          </form>
        </div>

        <div className="list-section">
          <h2>Pagos Excepcionales Registrados</h2>
          <div className="pagos-list">
            {pagos.length === 0 ? (
              <p className="no-data">No hay pagos registrados</p>
            ) : (
              pagos.map(pago => (
                <div key={pago._id} className="pago-card">
                  <div className="pago-header">
                    <h3>{pago.staffNombre}</h3>
                    <span className={`badge badge-${pago.estado}`}>
                      {pago.estado}
                    </span>
                  </div>
                  <div className="pago-details">
                    <p><strong>Cédula:</strong> {pago.staffCedula}</p>
                    <p><strong>Monto:</strong> ${pago.monto.toFixed(2)}</p>
                    <p><strong>Concepto:</strong> {pago.concepto}</p>
                    <p><strong>Fecha:</strong> {formatDate(pago.fechaPago)}</p>
                    <p><strong>Registrado por:</strong> {pago.contadoraNombre}</p>
                    {pago.observaciones && (
                      <p><strong>Observaciones:</strong> {pago.observaciones}</p>
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

export default RegistrarPagoExcepcional;
