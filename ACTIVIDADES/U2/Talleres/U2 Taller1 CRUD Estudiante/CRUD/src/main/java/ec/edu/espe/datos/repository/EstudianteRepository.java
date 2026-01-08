package ec.edu.espe.datos.repository;

import ec.edu.espe.datos.model.Estudiante;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para gestionar las operaciones CRUD de estudiantes
 * Utiliza ArrayList para almacenamiento interno
 * Implementa patrón Singleton para una única instancia
 */
public class EstudianteRepository {
    
    // Instancia única del repositorio (Singleton)
    private static EstudianteRepository instance;
    
    // Lista interna para almacenar estudiantes
    private List<Estudiante> estudiantes;
    
    /**
     * Constructor privado para implementar Singleton
     */
    private EstudianteRepository() {
        this.estudiantes = new ArrayList<>();
        inicializarDatosPrueba(); // Datos iniciales para pruebas
    }
    
    /**
     * Método para obtener la única instancia del repositorio
     */
    public static EstudianteRepository getInstance() {
        if (instance == null) {
            instance = new EstudianteRepository();
        }
        return instance;
    }
    
    /**
     * Agregar un nuevo estudiante al repositorio
     * @param estudiante El estudiante a agregar
     * @return true si se agregó exitosamente, false si ya existe el ID
     */
    public boolean agregar(Estudiante estudiante) {
        // Verificar que no exista un estudiante con el mismo ID
        if (buscarPorId(estudiante.getId()).isPresent()) {
            return false; // Ya existe un estudiante con ese ID
        }
        return estudiantes.add(estudiante);
    }
    
    /**
     * Editar un estudiante existente
     * @param estudiante El estudiante con los nuevos datos
     * @return true si se editó exitosamente, false si no se encontró
     */
    public boolean editar(Estudiante estudiante) {
        for (int i = 0; i < estudiantes.size(); i++) {
            if (estudiantes.get(i).getId() == estudiante.getId()) {
                estudiantes.set(i, estudiante);
                return true;
            }
        }
        return false; // No se encontró el estudiante
    }
    
    /**
     * Eliminar un estudiante por su ID
     * @param id El ID del estudiante a eliminar
     * @return true si se eliminó exitosamente, false si no se encontró
     */
    public boolean eliminar(int id) {
        return estudiantes.removeIf(estudiante -> estudiante.getId() == id);
    }
    
    /**
     * Buscar un estudiante por su ID
     * @param id El ID del estudiante a buscar
     * @return Optional con el estudiante si se encuentra, Optional.empty() si no
     */
    public Optional<Estudiante> buscarPorId(int id) {
        return estudiantes.stream()
                .filter(estudiante -> estudiante.getId() == id)
                .findFirst();
    }
    
    /**
     * Listar todos los estudiantes
     * @return Lista de todos los estudiantes
     */
    public List<Estudiante> listar() {
        return new ArrayList<>(estudiantes); // Retorna una copia para evitar modificaciones externas
    }
    
    /**
     * Obtener el siguiente ID disponible
     * @return El próximo ID disponible
     */
    public int obtenerSiguienteId() {
        return estudiantes.stream()
                .mapToInt(Estudiante::getId)
                .max()
                .orElse(0) + 1;
    }
    
    /**
     * Verificar si existe un estudiante con el ID especificado
     * @param id El ID a verificar
     * @return true si existe, false si no
     */
    public boolean existeId(int id) {
        return buscarPorId(id).isPresent();
    }
    
    /**
     * Obtener la cantidad total de estudiantes
     * @return Número total de estudiantes
     */
    public int contarEstudiantes() {
        return estudiantes.size();
    }
    
    /**
     * Limpiar todos los estudiantes (útil para pruebas)
     */
    public void limpiar() {
        estudiantes.clear();
    }
    
    /**
     * Inicializar algunos datos de prueba
     */
    private void inicializarDatosPrueba() {
        estudiantes.add(new Estudiante(1, "Juan Pérez", 20));
        estudiantes.add(new Estudiante(2, "María González", 22));
        estudiantes.add(new Estudiante(3, "Carlos López", 19));
    }
}