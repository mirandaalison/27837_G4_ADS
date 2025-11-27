package ec.edu.espe.datos.repository;

import ec.edu.espe.datos.model.Estudiante;
import ec.edu.espe.datos.repository.strategy.*;
import ec.edu.espe.datos.repository.observer.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para gestionar las operaciones CRUD de estudiantes
 * Utiliza ArrayList para almacenamiento interno
 * Implementa patrón Singleton para una única instancia
 * Implementa patrón Strategy para diferentes tipos de búsqueda
 * Implementa patrón Observer para notificar cambios
 */
public class EstudianteRepository {
    
    // Instancia única del repositorio (Singleton)
    private static EstudianteRepository instance;
    
    // Lista interna para almacenar estudiantes
    private List<Estudiante> estudiantes;
    
    // PATRÓN STRATEGY - Estrategia actual de búsqueda
    private IBusquedaStrategy estrategiaBusqueda;
    
    // PATRÓN OBSERVER - Lista de observadores
    private List<IRepositoryObserver> observadores;
    
    /**
     * Constructor privado para implementar Singleton
     */
    private EstudianteRepository() {
        this.estudiantes = new ArrayList<>();
        this.observadores = new ArrayList<>();
        this.estrategiaBusqueda = new BusquedaPorNombre(); // Estrategia por defecto
        
        // Agregar observadores por defecto
        agregarObservador(new LogObserver());
        agregarObservador(new EstadisticasObserver());
        
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
        
        boolean resultado = estudiantes.add(estudiante);
        
        // PATRÓN OBSERVER - Notificar a los observadores
        if (resultado) {
            notificarEstudianteAgregado(estudiante);
        }
        
        return resultado;
    }
    
    /**
     * Editar un estudiante existente
     * @param estudiante El estudiante con los nuevos datos
     * @return true si se editó exitosamente, false si no se encontró
     */
    public boolean editar(Estudiante estudiante) {
        for (int i = 0; i < estudiantes.size(); i++) {
            if (estudiantes.get(i).getId() == estudiante.getId()) {
                Estudiante estudianteAnterior = estudiantes.get(i);
                estudiantes.set(i, estudiante);
                
                // PATRÓN OBSERVER - Notificar a los observadores
                notificarEstudianteEditado(estudianteAnterior, estudiante);
                
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
        // Buscar el estudiante antes de eliminarlo para notificar
        Optional<Estudiante> estudianteOpt = buscarPorId(id);
        
        boolean resultado = estudiantes.removeIf(estudiante -> estudiante.getId() == id);
        
        // PATRÓN OBSERVER - Notificar a los observadores
        if (resultado && estudianteOpt.isPresent()) {
            notificarEstudianteEliminado(estudianteOpt.get());
        }
        
        return resultado;
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
        int cantidadAnterior = estudiantes.size();
        estudiantes.clear();
        
        // PATRÓN OBSERVER - Notificar a los observadores
        notificarRepositorioLimpiado(cantidadAnterior);
    }
    
    // ========== MÉTODOS PARA PATRÓN STRATEGY ==========
    
    /**
     * Buscar estudiantes usando la estrategia actual
     * @param criterio Criterio de búsqueda
     * @return Lista de estudiantes que cumplen el criterio
     */
    public List<Estudiante> buscarConEstrategia(String criterio) {
        return estrategiaBusqueda.buscar(estudiantes, criterio);
    }
    
    /**
     * Cambiar la estrategia de búsqueda
     * @param nuevaEstrategia La nueva estrategia a utilizar
     */
    public void cambiarEstrategiaBusqueda(IBusquedaStrategy nuevaEstrategia) {
        this.estrategiaBusqueda = nuevaEstrategia;
    }
    
    /**
     * Obtener el nombre de la estrategia actual
     * @return Nombre de la estrategia de búsqueda actual
     */
    public String getNombreEstrategiaActual() {
        return estrategiaBusqueda.getNombreEstrategia();
    }
    
    /**
     * Buscar por nombre usando la estrategia específica
     * @param nombre Nombre a buscar
     * @return Lista de estudiantes que contienen el nombre
     */
    public List<Estudiante> buscarPorNombre(String nombre) {
        IBusquedaStrategy estrategiaAnterior = this.estrategiaBusqueda;
        this.estrategiaBusqueda = new BusquedaPorNombre();
        List<Estudiante> resultado = buscarConEstrategia(nombre);
        this.estrategiaBusqueda = estrategiaAnterior; // Restaurar estrategia anterior
        return resultado;
    }
    
    /**
     * Buscar por edad usando la estrategia específica
     * @param edad Edad o rango de edad a buscar (ej: "20" o "18-25")
     * @return Lista de estudiantes que cumplen el criterio de edad
     */
    public List<Estudiante> buscarPorEdad(String edad) {
        IBusquedaStrategy estrategiaAnterior = this.estrategiaBusqueda;
        this.estrategiaBusqueda = new BusquedaPorEdad();
        List<Estudiante> resultado = buscarConEstrategia(edad);
        this.estrategiaBusqueda = estrategiaAnterior; // Restaurar estrategia anterior
        return resultado;
    }
    
    // ========== MÉTODOS PARA PATRÓN OBSERVER ==========
    
    /**
     * Agregar un observador al repositorio
     * @param observador El observador a agregar
     */
    public void agregarObservador(IRepositoryObserver observador) {
        if (!observadores.contains(observador)) {
            observadores.add(observador);
        }
    }
    
    /**
     * Remover un observador del repositorio
     * @param observador El observador a remover
     */
    public void removerObservador(IRepositoryObserver observador) {
        observadores.remove(observador);
    }
    
    /**
     * Obtener la lista de observadores (copia para evitar modificaciones externas)
     * @return Lista de observadores
     */
    public List<IRepositoryObserver> getObservadores() {
        return new ArrayList<>(observadores);
    }
    
    /**
     * Notificar a todos los observadores que se agregó un estudiante
     * @param estudiante El estudiante agregado
     */
    private void notificarEstudianteAgregado(Estudiante estudiante) {
        for (IRepositoryObserver observador : observadores) {
            observador.onEstudianteAgregado(estudiante);
        }
    }
    
    /**
     * Notificar a todos los observadores que se editó un estudiante
     * @param estudianteAnterior El estudiante antes de la edición
     * @param estudianteNuevo El estudiante después de la edición
     */
    private void notificarEstudianteEditado(Estudiante estudianteAnterior, Estudiante estudianteNuevo) {
        for (IRepositoryObserver observador : observadores) {
            observador.onEstudianteEditado(estudianteAnterior, estudianteNuevo);
        }
    }

    /**
     * Notificar a todos los observadores que se eliminó un estudiante
     * @param estudiante El estudiante eliminado
     */
    private void notificarEstudianteEliminado(Estudiante estudiante) {
        for (IRepositoryObserver observador : observadores) {
            observador.onEstudianteEliminado(estudiante);
        }
    }
    
    /**
     * Notificar a todos los observadores que se limpió el repositorio
     * @param cantidadEliminados La cantidad de estudiantes eliminados
     */
    private void notificarRepositorioLimpiado(int cantidadEliminados) {
        for (IRepositoryObserver observador : observadores) {
            observador.onRepositorioLimpiado(cantidadEliminados);
        }
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