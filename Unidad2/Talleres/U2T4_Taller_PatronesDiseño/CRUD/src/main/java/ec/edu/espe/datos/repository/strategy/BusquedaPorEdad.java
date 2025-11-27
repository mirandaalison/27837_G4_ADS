package ec.edu.espe.datos.repository.strategy;

import ec.edu.espe.datos.model.Estudiante;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Estrategia concreta para buscar estudiantes por rango de edad
 * PATRÓN STRATEGY - Implementación específica del algoritmo de búsqueda por edad
 */
public class BusquedaPorEdad implements IBusquedaStrategy {
    
    @Override
    public List<Estudiante> buscar(List<Estudiante> estudiantes, String criterio) {
        if (criterio == null || criterio.trim().isEmpty()) {
            return estudiantes; // Si no hay criterio, devolver todos
        }
        
        try {
            // Formato esperado: "18" (edad exacta) o "18-25" (rango de edades)
            String criterioBusqueda = criterio.trim();
            
            if (criterioBusqueda.contains("-")) {
                // Búsqueda por rango de edades
                String[] partes = criterioBusqueda.split("-");
                if (partes.length == 2) {
                    int edadMin = Integer.parseInt(partes[0].trim());
                    int edadMax = Integer.parseInt(partes[1].trim());
                    
                    return estudiantes.stream()
                            .filter(estudiante -> 
                                estudiante.getEdad() >= edadMin && 
                                estudiante.getEdad() <= edadMax)
                            .collect(Collectors.toList());
                }
            } else {
                // Búsqueda por edad exacta
                int edadBuscada = Integer.parseInt(criterioBusqueda);
                
                return estudiantes.stream()
                        .filter(estudiante -> estudiante.getEdad() == edadBuscada)
                        .collect(Collectors.toList());
            }
            
        } catch (NumberFormatException e) {
            // Si hay error de formato, devolver lista vacía
            return estudiantes.stream()
                    .limit(0)
                    .collect(Collectors.toList());
        }
        
        return estudiantes;
    }
    
    @Override
    public String getNombreEstrategia() {
        return "Búsqueda por Edad (ej: '20' o '18-25')";
    }
}