package ec.edu.espe.datos.repository.observer;

import ec.edu.espe.datos.model.Estudiante;

/**
 * Interfaz para el patrón Observer
 * Define los métodos que deben implementar los observadores del repositorio
 * PATRÓN OBSERVER - Permite notificar cambios a múltiples objetos interesados
 */
public interface IRepositoryObserver {
    
    /**
     * Se notifica cuando se agrega un estudiante
     * @param estudiante El estudiante que fue agregado
     */
    void onEstudianteAgregado(Estudiante estudiante);
    
    /**
     * Se notifica cuando se edita un estudiante
     * @param estudianteAnterior El estudiante antes de la edición
     * @param estudianteNuevo El estudiante después de la edición
     */
    void onEstudianteEditado(Estudiante estudianteAnterior, Estudiante estudianteNuevo);
    
    /**
     * Se notifica cuando se elimina un estudiante
     * @param estudiante El estudiante que fue eliminado
     */
    void onEstudianteEliminado(Estudiante estudiante);
    
    /**
     * Se notifica cuando se limpia el repositorio
     * @param cantidadEliminados La cantidad de estudiantes que había antes de limpiar
     */
    void onRepositorioLimpiado(int cantidadEliminados);
}