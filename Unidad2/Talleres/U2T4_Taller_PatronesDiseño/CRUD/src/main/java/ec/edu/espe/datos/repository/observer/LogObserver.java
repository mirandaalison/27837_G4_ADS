package ec.edu.espe.datos.repository.observer;

import ec.edu.espe.datos.model.Estudiante;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Observador concreto que registra las operaciones del repositorio en un log
 * PATRÓN OBSERVER - Implementación específica que reacciona a cambios en el repositorio
 */
public class LogObserver implements IRepositoryObserver {
    
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");
    
    @Override
    public void onEstudianteAgregado(Estudiante estudiante) {
        String timestamp = LocalDateTime.now().format(formatter);
        System.out.println("[LOG] " + timestamp + " - AGREGADO: " + estudiante.toString());
    }
    
    @Override
    public void onEstudianteEditado(Estudiante estudianteAnterior, Estudiante estudianteNuevo) {
        String timestamp = LocalDateTime.now().format(formatter);
        System.out.println("[LOG] " + timestamp + " - EDITADO:");
        System.out.println("    Anterior: " + estudianteAnterior.toString());
        System.out.println("    Nuevo: " + estudianteNuevo.toString());
    }
    
    @Override
    public void onEstudianteEliminado(Estudiante estudiante) {
        String timestamp = LocalDateTime.now().format(formatter);
        System.out.println("[LOG] " + timestamp + " - ELIMINADO: " + estudiante.toString());
    }
    
    @Override
    public void onRepositorioLimpiado(int cantidadEliminados) {
        String timestamp = LocalDateTime.now().format(formatter);
        System.out.println("[LOG] " + timestamp + " - REPOSITORIO LIMPIADO: " + 
                          cantidadEliminados + " estudiantes eliminados");
    }
}