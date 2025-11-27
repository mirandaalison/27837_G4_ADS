package ec.edu.espe.datos.repository.strategy;

import ec.edu.espe.datos.model.Estudiante;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Estrategia concreta para buscar estudiantes por nombre
 * PATRÓN STRATEGY - Implementación específica del algoritmo de búsqueda por nombre
 */
public class BusquedaPorNombre implements IBusquedaStrategy {
    
    @Override
    public List<Estudiante> buscar(List<Estudiante> estudiantes, String criterio) {
        if (criterio == null || criterio.trim().isEmpty()) {
            return estudiantes; // Si no hay criterio, devolver todos
        }
        
        String criterioBusqueda = criterio.trim().toLowerCase();
        
        return estudiantes.stream()
                .filter(estudiante -> 
                    estudiante.getNombres().toLowerCase().contains(criterioBusqueda))
                .collect(Collectors.toList());
    }
    
    @Override
    public String getNombreEstrategia() {
        return "Búsqueda por Nombre";
    }
}