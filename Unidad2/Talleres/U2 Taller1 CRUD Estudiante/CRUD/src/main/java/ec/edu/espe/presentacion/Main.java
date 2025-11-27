package ec.edu.espe.presentacion;

import javax.swing.*;

/**
 * Clase principal para ejecutar la aplicación CRUD de Estudiantes
 * Punto de entrada de la aplicación
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
                    // Crear y mostrar la ventana principal usando Singleton
                    EstudianteUI ventanaPrincipal = EstudianteUI.getInstance();
                    ventanaPrincipal.setVisible(true);
                    
                    // Mostrar mensaje de bienvenida
                    System.out.println("=".repeat(60));
                    System.out.println("  SISTEMA CRUD DE ESTUDIANTES");
                    System.out.println("  Arquitectura de 3 Capas + Patrón MVC");
                    System.out.println("=".repeat(60));
                    System.out.println("✓ Aplicación iniciada correctamente");
                    System.out.println("✓ Interfaz gráfica cargada");
                    System.out.println("✓ Datos iniciales disponibles");
                    System.out.println();
                    System.out.println("Instrucciones de uso:");
                    System.out.println("1. Hacer clic en 'Nuevo' para agregar un estudiante");
                    System.out.println("2. Seleccionar un estudiante de la tabla para editarlo o eliminarlo");
                    System.out.println("3. Usar 'Editar' para modificar datos del estudiante seleccionado");
                    System.out.println("4. Usar 'Eliminar' para borrar el estudiante seleccionado");
                    System.out.println("5. Usar 'Limpiar' para limpiar el formulario");
                    System.out.println();
                    System.out.println("Validaciones implementadas:");
                    System.out.println("- ID único y mayor que 0");
                    System.out.println("- Nombres obligatorios (2-100 caracteres)");
                    System.out.println("- Edad entre 15 y 120 años");
                    System.out.println("=".repeat(60));
                    
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
}

