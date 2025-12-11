package ec.edu.espe.datos.repository.strategy;

import ec.edu.espe.datos.model.Estudiante;
import java.util.List;

/**
 * Interfaz para el patrón Strategy
 * Define diferentes estrategias de búsqueda de estudiantes
 * PATRÓN STRATEGY - Permite cambiar algoritmos de búsqueda en tiempo de ejecución
 */
public interface IBusquedaStrategy {
    
    /**
     * Método que define el algoritmo de búsqueda
     * @param estudiantes Lista de estudiantes donde buscar
     * @param criterio Criterio de búsqueda
     * @return Lista de estudiantes que cumplen el criterio
     */
    List<Estudiante> buscar(List<Estudiante> estudiantes, String criterio);
    
    /**
     * Obtener el nombre de la estrategia
     * @return Nombre descriptivo de la estrategia
     */
    String getNombreEstrategia();
}