package ec.edu.espe.datos.repository.strategy;

import ec.edu.espe.datos.model.Estudiante;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Estrategia concreta para buscar estudiantes por ID
 * PATRÓN STRATEGY - Implementación específica del algoritmo de búsqueda por ID
 */
public class BusquedaPorId implements IBusquedaStrategy {
    
    @Override
    public List<Estudiante> buscar(List<Estudiante> estudiantes, String criterio) {
        if (criterio == null || criterio.trim().isEmpty()) {
            return estudiantes; // Si no hay criterio, devolver todos
        }
        
        try {
            int idBuscado = Integer.parseInt(criterio.trim());
            
            return estudiantes.stream()
                    .filter(estudiante -> estudiante.getId() == idBuscado)
                    .collect(Collectors.toList());
                    
        } catch (NumberFormatException e) {
            // Si hay error de formato, devolver lista vacía
            return estudiantes.stream()
                    .limit(0)
                    .collect(Collectors.toList());
        }
    }
    
    @Override
    public String getNombreEstrategia() {
        return "Búsqueda por ID";
    }
}