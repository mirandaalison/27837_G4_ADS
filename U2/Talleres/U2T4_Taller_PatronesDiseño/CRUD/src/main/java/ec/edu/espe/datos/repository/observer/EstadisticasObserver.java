package ec.edu.espe.datos.repository.observer;

import ec.edu.espe.datos.model.Estudiante;

/**
 * Observador concreto que mantiene estadísticas del repositorio
 * PATRÓN OBSERVER - Implementación específica que reacciona a cambios para llevar estadísticas
 */
public class EstadisticasObserver implements IRepositoryObserver {
    
    private int totalOperacionesAgregado = 0;
    private int totalOperacionesEdicion = 0;
    private int totalOperacionesEliminacion = 0;
    private int totalLimpiezas = 0;
    
    @Override
    public void onEstudianteAgregado(Estudiante estudiante) {
        totalOperacionesAgregado++;
        System.out.println("[ESTADÍSTICAS] Estudiantes agregados: " + totalOperacionesAgregado);
    }
    
    @Override
    public void onEstudianteEditado(Estudiante estudianteAnterior, Estudiante estudianteNuevo) {
        totalOperacionesEdicion++;
        System.out.println("[ESTADÍSTICAS] Estudiantes editados: " + totalOperacionesEdicion);
    }
    
    @Override
    public void onEstudianteEliminado(Estudiante estudiante) {
        totalOperacionesEliminacion++;
        System.out.println("[ESTADÍSTICAS] Estudiantes eliminados: " + totalOperacionesEliminacion);
    }
    
    @Override
    public void onRepositorioLimpiado(int cantidadEliminados) {
        totalLimpiezas++;
        System.out.println("[ESTADÍSTICAS] Limpiezas realizadas: " + totalLimpiezas);
        System.out.println("[ESTADÍSTICAS] Estudiantes eliminados en esta limpieza: " + cantidadEliminados);
    }
    
    /**
     * Obtener un resumen de todas las estadísticas
     * @return String con el resumen de estadísticas
     */
    public String obtenerResumenEstadisticas() {
        return String.format(
            "=== RESUMEN DE ESTADÍSTICAS ===%n" +
            "Total agregados: %d%n" +
            "Total editados: %d%n" +
            "Total eliminados: %d%n" +
            "Total limpiezas: %d%n" +
            "Total operaciones: %d",
            totalOperacionesAgregado,
            totalOperacionesEdicion, 
            totalOperacionesEliminacion,
            totalLimpiezas,
            totalOperacionesAgregado + totalOperacionesEdicion + totalOperacionesEliminacion + totalLimpiezas
        );
    }
    
    public int getTotalOperacionesAgregado() { return totalOperacionesAgregado; }
    public int getTotalOperacionesEdicion() { return totalOperacionesEdicion; }
    public int getTotalOperacionesEliminacion() { return totalOperacionesEliminacion; }
    public int getTotalLimpiezas() { return totalLimpiezas; }
}