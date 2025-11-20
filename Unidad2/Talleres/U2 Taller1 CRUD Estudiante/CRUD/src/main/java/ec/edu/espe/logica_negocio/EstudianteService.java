package ec.edu.espe.logica_negocio;

import ec.edu.espe.datos.model.Estudiante;
import ec.edu.espe.datos.repository.EstudianteRepository;
import java.util.List;
import java.util.Optional;

/**
 * Servicio de lógica de negocio para estudiantes
 * Contiene las validaciones y reglas de negocio
 * Delega las operaciones CRUD al repositorio
 */
public class EstudianteService {
    
    private EstudianteRepository estudianteRepository;
    
    /**
     * Constructor que inicializa el repositorio
     */
    public EstudianteService() {
        this.estudianteRepository = EstudianteRepository.getInstance();
    }
    
    /**
     * Agregar un nuevo estudiante con validaciones de negocio
     * @param estudiante El estudiante a agregar
     * @return Resultado de la operación con mensaje
     */
    public ResultadoOperacion agregarEstudiante(Estudiante estudiante) {
        // Validar datos del estudiante
        ResultadoOperacion validacion = validarEstudiante(estudiante);
        if (!validacion.isExito()) {
            return validacion;
        }
        
        // Verificar que el ID no esté duplicado
        if (estudianteRepository.existeId(estudiante.getId())) {
            return new ResultadoOperacion(false, "Error: Ya existe un estudiante con el ID " + estudiante.getId());
        }
        
        // Intentar agregar al repositorio
        boolean agregado = estudianteRepository.agregar(estudiante);
        if (agregado) {
            return new ResultadoOperacion(true, "Estudiante agregado exitosamente");
        } else {
            return new ResultadoOperacion(false, "Error: No se pudo agregar el estudiante");
        }
    }
    
    /**
     * Editar un estudiante existente con validaciones
     * @param estudiante El estudiante con los nuevos datos
     * @return Resultado de la operación con mensaje
     */
    public ResultadoOperacion editarEstudiante(Estudiante estudiante) {
        // Validar datos del estudiante
        ResultadoOperacion validacion = validarEstudiante(estudiante);
        if (!validacion.isExito()) {
            return validacion;
        }
        
        // Verificar que el estudiante exista
        if (!estudianteRepository.existeId(estudiante.getId())) {
            return new ResultadoOperacion(false, "Error: No existe un estudiante con el ID " + estudiante.getId());
        }
        
        // Intentar editar en el repositorio
        boolean editado = estudianteRepository.editar(estudiante);
        if (editado) {
            return new ResultadoOperacion(true, "Estudiante editado exitosamente");
        } else {
            return new ResultadoOperacion(false, "Error: No se pudo editar el estudiante");
        }
    }
    
    /**
     * Eliminar un estudiante por su ID
     * @param id El ID del estudiante a eliminar
     * @return Resultado de la operación con mensaje
     */
    public ResultadoOperacion eliminarEstudiante(int id) {
        // Validar que el ID sea válido
        if (id <= 0) {
            return new ResultadoOperacion(false, "Error: El ID debe ser mayor que 0");
        }
        
        // Verificar que el estudiante exista
        if (!estudianteRepository.existeId(id)) {
            return new ResultadoOperacion(false, "Error: No existe un estudiante con el ID " + id);
        }
        
        // Intentar eliminar del repositorio
        boolean eliminado = estudianteRepository.eliminar(id);
        if (eliminado) {
            return new ResultadoOperacion(true, "Estudiante eliminado exitosamente");
        } else {
            return new ResultadoOperacion(false, "Error: No se pudo eliminar el estudiante");
        }
    }
    
    /**
     * Buscar un estudiante por su ID
     * @param id El ID del estudiante a buscar
     * @return El estudiante si existe, null si no existe
     */
    public Estudiante buscarEstudiantePorId(int id) {
        Optional<Estudiante> estudianteOpt = estudianteRepository.buscarPorId(id);
        return estudianteOpt.orElse(null);
    }
    
    /**
     * Listar todos los estudiantes
     * @return Lista de todos los estudiantes
     */
    public List<Estudiante> listarTodosLosEstudiantes() {
        return estudianteRepository.listar();
    }
    
    /**
     * Obtener el siguiente ID disponible
     * @return El próximo ID disponible
     */
    public int obtenerSiguienteId() {
        return estudianteRepository.obtenerSiguienteId();
    }
    
    /**
     * Obtener estadísticas básicas
     * @return Número total de estudiantes
     */
    public int obtenerTotalEstudiantes() {
        return estudianteRepository.contarEstudiantes();
    }
    
    /**
     * Validar los datos de un estudiante según las reglas de negocio
     * @param estudiante El estudiante a validar
     * @return Resultado de la validación
     */
    private ResultadoOperacion validarEstudiante(Estudiante estudiante) {
        // Validar que el estudiante no sea null
        if (estudiante == null) {
            return new ResultadoOperacion(false, "Error: El estudiante no puede ser nulo");
        }
        
        // Validar ID
        if (estudiante.getId() <= 0) {
            return new ResultadoOperacion(false, "Error: El ID debe ser mayor que 0");
        }
        
        // Validar nombres
        if (estudiante.getNombres() == null || estudiante.getNombres().trim().isEmpty()) {
            return new ResultadoOperacion(false, "Error: Los nombres son obligatorios");
        }
        
        if (estudiante.getNombres().trim().length() < 2) {
            return new ResultadoOperacion(false, "Error: Los nombres deben tener al menos 2 caracteres");
        }
        
        if (estudiante.getNombres().length() > 100) {
            return new ResultadoOperacion(false, "Error: Los nombres no pueden exceder 100 caracteres");
        }
        
        // Validar edad
        if (estudiante.getEdad() <= 0) {
            return new ResultadoOperacion(false, "Error: La edad debe ser mayor que 0");
        }
        
        if (estudiante.getEdad() > 120) {
            return new ResultadoOperacion(false, "Error: La edad no puede ser mayor que 120 años");
        }
        
        if (estudiante.getEdad() < 15) {
            return new ResultadoOperacion(false, "Error: La edad mínima para estudiantes es 15 años");
        }
        
        return new ResultadoOperacion(true, "Datos válidos");
    }
    
    /**
     * Clase interna para representar el resultado de una operación
     */
    public static class ResultadoOperacion {
        private boolean exito;
        private String mensaje;
        
        public ResultadoOperacion(boolean exito, String mensaje) {
            this.exito = exito;
            this.mensaje = mensaje;
        }
        
        public boolean isExito() {
            return exito;
        }
        
        public String getMensaje() {
            return mensaje;
        }
        
        @Override
        public String toString() {
            return mensaje;
        }
    }
}