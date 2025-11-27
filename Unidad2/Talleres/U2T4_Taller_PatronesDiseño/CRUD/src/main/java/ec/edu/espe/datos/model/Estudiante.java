package ec.edu.espe.datos.model;

/**
 * Clase modelo que representa un estudiante
 * Contiene los atributos básicos: ID, nombres y edad
 */
public class Estudiante {
    private int id;
    private String nombres;
    private int edad;

    /**
     * Constructor por defecto
     */
    public Estudiante() {
    }

    /**
     * Constructor con parámetros
     * @param id Identificador único del estudiante
     * @param nombres Nombres completos del estudiante
     * @param edad Edad del estudiante
     */
    public Estudiante(int id, String nombres, int edad) {
        this.id = id;
        this.nombres = nombres;
        this.edad = edad;
    }

    // Getters
    public int getId() {
        return id;
    }

    public String getNombres() {
        return nombres;
    }

    public int getEdad() {
        return edad;
    }

    // Setters
    public void setId(int id) {
        this.id = id;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public void setEdad(int edad) {
        this.edad = edad;
    }

    /**
     * Método toString para representación en texto del objeto
     */
    @Override
    public String toString() {
        return "Estudiante{" +
                "id=" + id +
                ", nombres='" + nombres + '\'' +
                ", edad=" + edad +
                '}';
    }

    /**
     * Método equals para comparar estudiantes por ID
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Estudiante estudiante = (Estudiante) obj;
        return id == estudiante.id;
    }

    /**
     * Método hashCode basado en el ID del estudiante
     */
    @Override
    public int hashCode() {
        return Integer.hashCode(id);
    }
}