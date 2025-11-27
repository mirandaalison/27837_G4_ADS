package ec.edu.espe.presentacion;

import ec.edu.espe.datos.model.Estudiante;
import ec.edu.espe.datos.repository.EstudianteRepository;
import ec.edu.espe.datos.repository.strategy.*;
import java.util.List;
import javax.swing.*;

/**
 * Clase principal para ejecutar la aplicación CRUD de Estudiantes
 * Punto de entrada de la aplicación
 * Demuestra el uso de los patrones Strategy y Observer
 */
public class Main {
    
    /**
     * Método principal que inicia la aplicación
     * @param args Argumentos de línea de comandos (no utilizados)
     */
    public static void main(String[] args) {
        
        // Ejecutar la interfaz gráfica en el Event Dispatch Thread
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                try {
                    // Mostrar demo de los nuevos patrones
                    demostrarPatrones();
                    
                    // Crear y mostrar la ventana principal usando Singleton
                    EstudianteUI ventanaPrincipal = EstudianteUI.getInstance();
                    ventanaPrincipal.setVisible(true);
                    
                    // Mostrar mensaje de bienvenida
                    System.out.println("=".repeat(80));
                    System.out.println("  SISTEMA CRUD DE ESTUDIANTES - CON PATRONES DE DISEÑO");
                    System.out.println("  Arquitectura de 3 Capas + Patrón MVC");
                    System.out.println("  ✓ Singleton  ✓ Strategy  ✓ Observer");
                    System.out.println("=".repeat(80));
                    System.out.println("✓ Aplicación iniciada correctamente");
                    System.out.println("✓ Interfaz gráfica cargada");
                    System.out.println("✓ Datos iniciales disponibles");
                    System.out.println("✓ Patrones Strategy y Observer funcionando");
                    System.out.println();
                    System.out.println("Instrucciones de uso:");
                    System.out.println("1. Hacer clic en 'Nuevo' para agregar un estudiante");
                    System.out.println("2. Seleccionar un estudiante de la tabla para editarlo o eliminarlo");
                    System.out.println("3. Usar 'Editar' para modificar datos del estudiante seleccionado");
                    System.out.println("4. Usar 'Eliminar' para borrar el estudiante seleccionado");
                    System.out.println("5. Usar 'Limpiar' para limpiar el formulario");
                    System.out.println();
                    System.out.println("Nuevas funcionalidades:");
                    System.out.println("- Búsquedas avanzadas (Strategy Pattern)");
                    System.out.println("- Logging automático de operaciones (Observer Pattern)");
                    System.out.println("- Estadísticas de uso en tiempo real");
                    System.out.println();
                    System.out.println("Validaciones implementadas:");
                    System.out.println("- ID único y mayor que 0");
                    System.out.println("- Nombres obligatorios (2-100 caracteres)");
                    System.out.println("- Edad entre 15 y 120 años");
                    System.out.println("=".repeat(80));
                    
                } catch (Exception e) {
                    System.err.println("Error al iniciar la aplicación: " + e.getMessage());
                    e.printStackTrace();
                    
                    // Mostrar error en ventana
                    JOptionPane.showMessageDialog(null, 
                        "Error al iniciar la aplicación:\n" + e.getMessage(), 
                        "Error Crítico", 
                        JOptionPane.ERROR_MESSAGE);
                    
                    System.exit(1);
                }
            }
        });
    }
    
    /**
     * Demostrar el funcionamiento de los patrones Strategy y Observer
     */
    private static void demostrarPatrones() {
        System.out.println("\n" + "=".repeat(80));
        System.out.println("🎯 DEMOSTRACIÓN DE PATRONES DE DISEÑO");
        System.out.println("=".repeat(80));
        
        // Obtener instancia del repositorio (Singleton)
        EstudianteRepository repo = EstudianteRepository.getInstance();
        
        // === DEMOSTRACIÓN PATRÓN STRATEGY ===
        System.out.println("\n🔍 PATRÓN STRATEGY - Diferentes algoritmos de búsqueda:");
        System.out.println("-".repeat(60));
        
        // Búsqueda por nombre
        System.out.println("📝 Búsqueda por nombre 'juan':");
        List<Estudiante> porNombre = repo.buscarPorNombre("juan");
        for (Estudiante e : porNombre) {
            System.out.println("   → " + e.toString());
        }
        
        // Búsqueda por edad exacta
        System.out.println("\n🎂 Búsqueda por edad '20':");
        List<Estudiante> porEdad20 = repo.buscarPorEdad("20");
        for (Estudiante e : porEdad20) {
            System.out.println("   → " + e.toString());
        }
        
        // Búsqueda por rango de edad
        System.out.println("\n📊 Búsqueda por rango de edad '19-22':");
        List<Estudiante> porRango = repo.buscarPorEdad("19-22");
        for (Estudiante e : porRango) {
            System.out.println("   → " + e.toString());
        }
        
        // Cambio dinámico de estrategia
        System.out.println("\n⚙️  Cambio dinámico de estrategia a 'Búsqueda por ID':");
        repo.cambiarEstrategiaBusqueda(new BusquedaPorId());
        System.out.println("   Estrategia actual: " + repo.getNombreEstrategiaActual());
        List<Estudiante> porId = repo.buscarConEstrategia("2");
        for (Estudiante e : porId) {
            System.out.println("   → " + e.toString());
        }
        
        // === DEMOSTRACIÓN PATRÓN OBSERVER ===
        System.out.println("\n" + "=".repeat(80));
        System.out.println("👁️  PATRÓN OBSERVER - Notificaciones automáticas:");
        System.out.println("-".repeat(60));
        System.out.println("Los siguientes logs aparecen automáticamente al realizar operaciones:");
        System.out.println();
        
        // Agregar un estudiante para ver notificaciones
        Estudiante nuevoEstudiante = new Estudiante(99, "Estudiante Demo", 25);
        System.out.println("🔄 Agregando estudiante demo...");
        repo.agregar(nuevoEstudiante);
        
        // Editar el estudiante
        System.out.println("\n🔄 Editando estudiante demo...");
        Estudiante estudianteEditado = new Estudiante(99, "Estudiante Demo Editado", 26);
        repo.editar(estudianteEditado);
        
        // Eliminar el estudiante
        System.out.println("\n🔄 Eliminando estudiante demo...");
        repo.eliminar(99);
        
        System.out.println("\n✅ Demostración completada. Observe los logs automáticos arriba.");
        System.out.println("=".repeat(80));
    }
}