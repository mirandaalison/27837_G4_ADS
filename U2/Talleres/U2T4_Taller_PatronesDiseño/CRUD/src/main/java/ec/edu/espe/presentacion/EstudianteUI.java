package ec.edu.espe.presentacion;

import ec.edu.espe.datos.model.Estudiante;
import ec.edu.espe.datos.repository.EstudianteRepository;
import ec.edu.espe.datos.repository.strategy.*;
import ec.edu.espe.logica_negocio.EstudianteService;
import ec.edu.espe.logica_negocio.EstudianteService.ResultadoOperacion;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.List;

/**
 * Interfaz gráfica de usuario para la gestión de estudiantes
 * Implementa el patrón MVC como Vista y Controlador
 * Utiliza Java Swing para la interfaz gráfica
 * IMPLEMENTA PATRÓN SINGLETON para una única ventana
 */
public class EstudianteUI extends JFrame {
    
    // 1. INSTANCIA ESTÁTICA - Una sola ventana para toda la aplicación
    private static EstudianteUI instance;
    
    // Componentes de la interfaz
    private JTextField txtId;
    private JTextField txtNombres;
    private JTextField txtEdad;
    private JButton btnGuardar;
    private JButton btnEditar;
    private JButton btnEliminar;
    private JButton btnLimpiar;
    private JButton btnNuevo;
    private JTable tblEstudiantes;
    private DefaultTableModel modeloTabla;
    private JLabel lblEstado;
    
    // COMPONENTES DE BÚSQUEDA (Strategy Pattern)
    private JTextField txtBusqueda;
    private JComboBox<String> cmbTipoBusqueda;
    private JButton btnBuscar;
    private JButton btnMostrarTodos;
    
    // Servicio de lógica de negocio
    private EstudianteService estudianteService;
    
    // Repositorio para búsquedas (Strategy Pattern)
    private EstudianteRepository estudianteRepository;
    
    // Variable para controlar el modo de edición
    private boolean modoEdicion = false;
    
    /**
     * 2. CONSTRUCTOR PRIVADO - Nadie puede hacer 'new EstudianteUI()'
     */
    private EstudianteUI() {
        this.estudianteService = EstudianteService.getInstance();
        this.estudianteRepository = EstudianteRepository.getInstance();
        inicializarComponentes();
        configurarEventos();
        cargarDatos();
        establecerEstadoInicial();
    }
    
    /**
     * 3. MÉTODO PARA OBTENER LA ÚNICA INSTANCIA
     * Si ya existe, la trae al frente en lugar de crear otra
     */
    public static EstudianteUI getInstance() {
        if (instance == null) {
            instance = new EstudianteUI();
        } else {
            // Si ya existe, traer ventana al frente
            instance.toFront();
            instance.requestFocus();
        }
        return instance;
    }
    
    /**
     * Inicializar todos los componentes de la interfaz
     */
    private void inicializarComponentes() {
        // Configuración de la ventana principal
        setTitle("Gestión de Estudiantes - CRUD con Arquitectura 3 Capas");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout());
        setResizable(true);
        
        // Crear panel principal
        JPanel panelPrincipal = new JPanel(new BorderLayout(10, 10));
        panelPrincipal.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));
        
        // Panel del formulario
        JPanel panelFormulario = crearPanelFormulario();
        
        // Panel de búsqueda
        JPanel panelBusqueda = crearPanelBusqueda();
        
        // Panel de la tabla
        JPanel panelTabla = crearPanelTabla();
        
        // Panel de estado
        JPanel panelEstado = crearPanelEstado();
        
        // Agregar paneles al panel principal
        panelPrincipal.add(panelFormulario, BorderLayout.NORTH);
        JPanel panelCentral = new JPanel(new BorderLayout());
        panelCentral.add(panelBusqueda, BorderLayout.NORTH);
        panelCentral.add(panelTabla, BorderLayout.CENTER);
        panelPrincipal.add(panelCentral, BorderLayout.CENTER);
        panelPrincipal.add(panelEstado, BorderLayout.SOUTH);
        
        add(panelPrincipal);
        
        // Configurar tamaño y centrar ventana
        setSize(800, 600);
        setLocationRelativeTo(null);
    }
    
    /**
     * Crear el panel del formulario de entrada de datos
     */
    private JPanel crearPanelFormulario() {
        JPanel panel = new JPanel(new GridBagLayout());
        panel.setBorder(BorderFactory.createTitledBorder("Datos del Estudiante"));
        
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);
        
        // ID
        gbc.gridx = 0; gbc.gridy = 0; gbc.anchor = GridBagConstraints.EAST;
        panel.add(new JLabel("ID:"), gbc);
        
        gbc.gridx = 1; gbc.gridy = 0; gbc.fill = GridBagConstraints.HORIZONTAL; gbc.weightx = 1.0;
        txtId = new JTextField(10);
        panel.add(txtId, gbc);
        
        // Nombres
        gbc.gridx = 0; gbc.gridy = 1; gbc.anchor = GridBagConstraints.EAST; gbc.fill = GridBagConstraints.NONE; gbc.weightx = 0.0;
        panel.add(new JLabel("Nombres:"), gbc);
        
        gbc.gridx = 1; gbc.gridy = 1; gbc.fill = GridBagConstraints.HORIZONTAL; gbc.weightx = 1.0;
        txtNombres = new JTextField(20);
        panel.add(txtNombres, gbc);
        
        // Edad
        gbc.gridx = 0; gbc.gridy = 2; gbc.anchor = GridBagConstraints.EAST; gbc.fill = GridBagConstraints.NONE; gbc.weightx = 0.0;
        panel.add(new JLabel("Edad:"), gbc);
        
        gbc.gridx = 1; gbc.gridy = 2; gbc.fill = GridBagConstraints.HORIZONTAL; gbc.weightx = 1.0;
        txtEdad = new JTextField(10);
        panel.add(txtEdad, gbc);
        
        // Panel de botones
        JPanel panelBotones = new JPanel(new FlowLayout());
        btnNuevo = new JButton("Nuevo");
        btnGuardar = new JButton("Guardar");
        btnEditar = new JButton("Editar");
        btnEliminar = new JButton("Eliminar");
        btnLimpiar = new JButton("Limpiar");
        
        // Configurar colores de los botones
        btnNuevo.setBackground(new Color(46, 125, 50));
        btnNuevo.setForeground(Color.WHITE);
        btnGuardar.setBackground(new Color(25, 118, 210));
        btnGuardar.setForeground(Color.WHITE);
        btnEditar.setBackground(new Color(255, 152, 0));
        btnEditar.setForeground(Color.WHITE);
        btnEliminar.setBackground(new Color(211, 47, 47));
        btnEliminar.setForeground(Color.WHITE);
        btnLimpiar.setBackground(new Color(158, 158, 158));
        btnLimpiar.setForeground(Color.WHITE);
        
        panelBotones.add(btnNuevo);
        panelBotones.add(btnGuardar);
        panelBotones.add(btnEditar);
        panelBotones.add(btnEliminar);
        panelBotones.add(btnLimpiar);
        
        gbc.gridx = 0; gbc.gridy = 3; gbc.gridwidth = 2; gbc.fill = GridBagConstraints.HORIZONTAL;
        panel.add(panelBotones, gbc);
        
        return panel;
    }
    
    /**
     * Crear el panel de la tabla de estudiantes
     */
    private JPanel crearPanelTabla() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBorder(BorderFactory.createTitledBorder("Lista de Estudiantes"));
        
        // Crear modelo de tabla
        String[] columnas = {"ID", "Nombres", "Edad"};
        modeloTabla = new DefaultTableModel(columnas, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false; // No permitir edición directa en la tabla
            }
        };
        
        // Crear tabla
        tblEstudiantes = new JTable(modeloTabla);
        tblEstudiantes.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        tblEstudiantes.setRowHeight(25);
        
        // Configurar ancho de columnas
        tblEstudiantes.getColumnModel().getColumn(0).setPreferredWidth(50);
        tblEstudiantes.getColumnModel().getColumn(1).setPreferredWidth(300);
        tblEstudiantes.getColumnModel().getColumn(2).setPreferredWidth(80);
        
        // Agregar listener para selección de filas
        tblEstudiantes.getSelectionModel().addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting()) {
                cargarEstudianteSeleccionado();
            }
        });
        
        // Scroll pane para la tabla
        JScrollPane scrollPane = new JScrollPane(tblEstudiantes);
        scrollPane.setPreferredSize(new Dimension(700, 300));
        
        panel.add(scrollPane, BorderLayout.CENTER);
        
        return panel;
    }
    
    /**
     * Crear el panel de búsqueda usando Strategy Pattern
     */
    private JPanel crearPanelBusqueda() {
        JPanel panel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        panel.setBorder(BorderFactory.createTitledBorder("🔍 Búsqueda Avanzada (Strategy Pattern)"));
        
        // Campo de búsqueda
        panel.add(new JLabel("Buscar:"));
        txtBusqueda = new JTextField(15);
        panel.add(txtBusqueda);
        
        // ComboBox para tipo de búsqueda
        panel.add(new JLabel("Tipo:"));
        String[] tiposBusqueda = {
            "Por Nombre", 
            "Por Edad", 
            "Por Rango de Edad (ej: 18-25)", 
            "Por ID"
        };
        cmbTipoBusqueda = new JComboBox<>(tiposBusqueda);
        panel.add(cmbTipoBusqueda);
        
        // Botón buscar
        btnBuscar = new JButton("🔍 Buscar");
        btnBuscar.setBackground(new Color(76, 175, 80));
        btnBuscar.setForeground(Color.WHITE);
        panel.add(btnBuscar);
        
        // Botón mostrar todos
        btnMostrarTodos = new JButton("📋 Mostrar Todos");
        btnMostrarTodos.setBackground(new Color(96, 125, 139));
        btnMostrarTodos.setForeground(Color.WHITE);
        panel.add(btnMostrarTodos);
        
        return panel;
    }
    
    /**
     * Crear el panel de estado/información
     */
    private JPanel crearPanelEstado() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBorder(BorderFactory.createEtchedBorder());
        
        lblEstado = new JLabel("Listo");
        lblEstado.setBorder(BorderFactory.createEmptyBorder(5, 10, 5, 10));
        
        panel.add(lblEstado, BorderLayout.WEST);
        
        return panel;
    }
    
    /**
     * Configurar los eventos de los componentes
     */
    private void configurarEventos() {
        // Evento del botón Nuevo
        btnNuevo.addActionListener(e -> {
            limpiarFormulario();
            modoEdicion = false;
            txtId.setText(String.valueOf(estudianteService.obtenerSiguienteId()));
            establecerEstadoNuevo();
            actualizarEstado("Modo: Nuevo estudiante");
        });
        
        // Evento del botón Guardar
        btnGuardar.addActionListener(e -> guardarEstudiante());
        
        // Evento del botón Editar
        btnEditar.addActionListener(e -> {
            if (tblEstudiantes.getSelectedRow() != -1) {
                modoEdicion = true;
                establecerEstadoEdicion();
                actualizarEstado("Modo: Editando estudiante");
            } else {
                JOptionPane.showMessageDialog(this, 
                    "Seleccione un estudiante de la tabla para editar", 
                    "Advertencia", 
                    JOptionPane.WARNING_MESSAGE);
            }
        });
        
        // Evento del botón Eliminar
        btnEliminar.addActionListener(e -> eliminarEstudiante());
        
        // Evento del botón Limpiar
        btnLimpiar.addActionListener(e -> {
            limpiarFormulario();
            modoEdicion = false;
            establecerEstadoInicial();
            actualizarEstado("Formulario limpiado");
        });
        
        // EVENTOS DE BÚSQUEDA (Strategy Pattern)
        btnBuscar.addActionListener(e -> realizarBusqueda());
        
        btnMostrarTodos.addActionListener(e -> {
            cargarDatos();
            txtBusqueda.setText("");
            actualizarEstado("Mostrando todos los estudiantes");
        });
        
        // Búsqueda al presionar Enter en el campo de búsqueda
        txtBusqueda.addActionListener(e -> realizarBusqueda());
    }
    
    /**
     * Guardar un estudiante (nuevo o editado)
     */
    private void guardarEstudiante() {
        try {
            // Validar y obtener datos del formulario
            int id = Integer.parseInt(txtId.getText().trim());
            String nombres = txtNombres.getText().trim();
            int edad = Integer.parseInt(txtEdad.getText().trim());
            
            // Crear objeto estudiante
            Estudiante estudiante = new Estudiante(id, nombres, edad);
            
            // Llamar al servicio según el modo
            ResultadoOperacion resultado;
            if (modoEdicion) {
                resultado = estudianteService.editarEstudiante(estudiante);
            } else {
                resultado = estudianteService.agregarEstudiante(estudiante);
            }
            
            // Mostrar resultado
            if (resultado.isExito()) {
                JOptionPane.showMessageDialog(this, 
                    resultado.getMensaje(), 
                    "Éxito", 
                    JOptionPane.INFORMATION_MESSAGE);
                
                cargarDatos();
                limpiarFormulario();
                modoEdicion = false;
                establecerEstadoInicial();
                actualizarEstado(resultado.getMensaje());
            } else {
                JOptionPane.showMessageDialog(this, 
                    resultado.getMensaje(), 
                    "Error", 
                    JOptionPane.ERROR_MESSAGE);
                actualizarEstado(resultado.getMensaje());
            }
            
        } catch (NumberFormatException e) {
            JOptionPane.showMessageDialog(this, 
                "Error: ID y Edad deben ser números válidos", 
                "Error de Formato", 
                JOptionPane.ERROR_MESSAGE);
            actualizarEstado("Error: Formato de datos incorrecto");
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, 
                "Error inesperado: " + e.getMessage(), 
                "Error", 
                JOptionPane.ERROR_MESSAGE);
            actualizarEstado("Error inesperado");
        }
    }
    
    /**
     * Eliminar el estudiante seleccionado
     */
    private void eliminarEstudiante() {
        int filaSeleccionada = tblEstudiantes.getSelectedRow();
        
        if (filaSeleccionada == -1) {
            JOptionPane.showMessageDialog(this, 
                "Seleccione un estudiante de la tabla para eliminar", 
                "Advertencia", 
                JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        // Confirmar eliminación
        int confirmacion = JOptionPane.showConfirmDialog(this, 
            "¿Está seguro de que desea eliminar este estudiante?", 
            "Confirmar Eliminación", 
            JOptionPane.YES_NO_OPTION, 
            JOptionPane.QUESTION_MESSAGE);
        
        if (confirmacion == JOptionPane.YES_OPTION) {
            try {
                // Obtener ID del estudiante seleccionado
                int id = (Integer) modeloTabla.getValueAt(filaSeleccionada, 0);
                
                // Llamar al servicio para eliminar
                ResultadoOperacion resultado = estudianteService.eliminarEstudiante(id);
                
                // Mostrar resultado
                if (resultado.isExito()) {
                    JOptionPane.showMessageDialog(this, 
                        resultado.getMensaje(), 
                        "Éxito", 
                        JOptionPane.INFORMATION_MESSAGE);
                    
                    cargarDatos();
                    limpiarFormulario();
                    establecerEstadoInicial();
                    actualizarEstado(resultado.getMensaje());
                } else {
                    JOptionPane.showMessageDialog(this, 
                        resultado.getMensaje(), 
                        "Error", 
                        JOptionPane.ERROR_MESSAGE);
                    actualizarEstado(resultado.getMensaje());
                }
                
            } catch (Exception e) {
                JOptionPane.showMessageDialog(this, 
                    "Error al eliminar: " + e.getMessage(), 
                    "Error", 
                    JOptionPane.ERROR_MESSAGE);
                actualizarEstado("Error al eliminar estudiante");
            }
        }
    }
    
    /**
     * Realizar búsqueda usando Strategy Pattern
     */
    private void realizarBusqueda() {
        String criterio = txtBusqueda.getText().trim();
        
        if (criterio.isEmpty()) {
            JOptionPane.showMessageDialog(this, 
                "Ingrese un criterio de búsqueda", 
                "Advertencia", 
                JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        try {
            List<Estudiante> resultados;
            String tipoSeleccionado = (String) cmbTipoBusqueda.getSelectedItem();
            
            // USAR STRATEGY PATTERN SEGÚN LA SELECCIÓN
            switch (tipoSeleccionado) {
                case "Por Nombre":
                    estudianteRepository.cambiarEstrategiaBusqueda(new BusquedaPorNombre());
                    resultados = estudianteRepository.buscarConEstrategia(criterio);
                    actualizarEstado("Búsqueda por nombre: '" + criterio + "' - " + resultados.size() + " encontrados");
                    break;
                    
                case "Por Edad":
                    estudianteRepository.cambiarEstrategiaBusqueda(new BusquedaPorEdad());
                    resultados = estudianteRepository.buscarConEstrategia(criterio);
                    actualizarEstado("Búsqueda por edad: '" + criterio + "' - " + resultados.size() + " encontrados");
                    break;
                    
                case "Por Rango de Edad (ej: 18-25)":
                    estudianteRepository.cambiarEstrategiaBusqueda(new BusquedaPorEdad());
                    resultados = estudianteRepository.buscarConEstrategia(criterio);
                    actualizarEstado("Búsqueda por rango: '" + criterio + "' - " + resultados.size() + " encontrados");
                    break;
                    
                case "Por ID":
                    estudianteRepository.cambiarEstrategiaBusqueda(new BusquedaPorId());
                    resultados = estudianteRepository.buscarConEstrategia(criterio);
                    actualizarEstado("Búsqueda por ID: '" + criterio + "' - " + resultados.size() + " encontrados");
                    break;
                    
                default:
                    resultados = estudianteService.listarTodosLosEstudiantes();
                    actualizarEstado("Mostrando todos los estudiantes");
                    break;
            }
            
            // Actualizar tabla con resultados
            actualizarTablaConResultados(resultados);
            
            // Mostrar estrategia utilizada en consola
            System.out.println("🎯 Strategy usado: " + estudianteRepository.getNombreEstrategiaActual());
            
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, 
                "Error en la búsqueda: " + ex.getMessage(), 
                "Error", 
                JOptionPane.ERROR_MESSAGE);
            actualizarEstado("Error en búsqueda: " + ex.getMessage());
        }
    }
    
    /**
     * Actualizar tabla con resultados de búsqueda
     */
    private void actualizarTablaConResultados(List<Estudiante> estudiantes) {
        // Limpiar tabla
        modeloTabla.setRowCount(0);
        
        // Agregar filas con los resultados
        for (Estudiante estudiante : estudiantes) {
            Object[] fila = {
                estudiante.getId(),
                estudiante.getNombres(),
                estudiante.getEdad()
            };
            modeloTabla.addRow(fila);
        }
        
        // Si no hay resultados, mostrar mensaje
        if (estudiantes.isEmpty()) {
            JOptionPane.showMessageDialog(this, 
                "No se encontraron estudiantes con el criterio especificado", 
                "Sin resultados", 
                JOptionPane.INFORMATION_MESSAGE);
        }
    }
    
    /**
     * Cargar estudiante seleccionado en el formulario
     */
    private void cargarEstudianteSeleccionado() {
        int filaSeleccionada = tblEstudiantes.getSelectedRow();
        
        if (filaSeleccionada != -1 && !modoEdicion) {
            // Cargar datos en el formulario
            txtId.setText(modeloTabla.getValueAt(filaSeleccionada, 0).toString());
            txtNombres.setText(modeloTabla.getValueAt(filaSeleccionada, 1).toString());
            txtEdad.setText(modeloTabla.getValueAt(filaSeleccionada, 2).toString());
            
            establecerEstadoSeleccionado();
            actualizarEstado("Estudiante seleccionado: " + txtNombres.getText());
        }
    }
    
    /**
     * Cargar datos en la tabla desde el servicio
     */
    private void cargarDatos() {
        // Limpiar tabla
        modeloTabla.setRowCount(0);
        
        // Obtener lista de estudiantes
        List<Estudiante> estudiantes = estudianteService.listarTodosLosEstudiantes();
        
        // Agregar filas a la tabla
        for (Estudiante estudiante : estudiantes) {
            Object[] fila = {
                estudiante.getId(),
                estudiante.getNombres(),
                estudiante.getEdad()
            };
            modeloTabla.addRow(fila);
        }
        
        // Actualizar información de estado
        int totalEstudiantes = estudianteService.obtenerTotalEstudiantes();
        actualizarEstado("Total de estudiantes: " + totalEstudiantes);
    }
    
    /**
     * Limpiar todos los campos del formulario
     */
    private void limpiarFormulario() {
        txtId.setText("");
        txtNombres.setText("");
        txtEdad.setText("");
        tblEstudiantes.clearSelection();
    }
    
    /**
     * Establecer estado inicial de la interfaz
     */
    private void establecerEstadoInicial() {
        txtId.setEditable(false);
        txtNombres.setEditable(false);
        txtEdad.setEditable(false);
        
        btnGuardar.setEnabled(false);
        btnEditar.setEnabled(false);
        btnEliminar.setEnabled(false);
        btnNuevo.setEnabled(true);
        btnLimpiar.setEnabled(true);
    }
    
    /**
     * Establecer estado para nuevo estudiante
     */
    private void establecerEstadoNuevo() {
        txtId.setEditable(false); // ID se genera automáticamente
        txtNombres.setEditable(true);
        txtEdad.setEditable(true);
        
        btnGuardar.setEnabled(true);
        btnEditar.setEnabled(false);
        btnEliminar.setEnabled(false);
        btnNuevo.setEnabled(false);
        btnLimpiar.setEnabled(true);
    }
    
    /**
     * Establecer estado para edición
     */
    private void establecerEstadoEdicion() {
        txtId.setEditable(false); // ID no se puede cambiar
        txtNombres.setEditable(true);
        txtEdad.setEditable(true);
        
        btnGuardar.setEnabled(true);
        btnEditar.setEnabled(false);
        btnEliminar.setEnabled(false);
        btnNuevo.setEnabled(false);
        btnLimpiar.setEnabled(true);
    }
    
    /**
     * Establecer estado cuando se selecciona un estudiante
     */
    private void establecerEstadoSeleccionado() {
        txtId.setEditable(false);
        txtNombres.setEditable(false);
        txtEdad.setEditable(false);
        
        btnGuardar.setEnabled(false);
        btnEditar.setEnabled(true);
        btnEliminar.setEnabled(true);
        btnNuevo.setEnabled(true);
        btnLimpiar.setEnabled(true);
    }
    
    /**
     * Actualizar el texto del estado
     */
    private void actualizarEstado(String mensaje) {
        lblEstado.setText(mensaje);
    }
}