import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Cuestionario } from '../../interfaces/cuestionario.interface';
import { Pregunta } from '../../interfaces/pregunta.interface';
import { Rol } from '../../interfaces/rol.interface';
import { EjecucionCuestionario } from '../../interfaces/ejecucion-cuestionario.interface';

@Component({
  selector: 'app-cuestionarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cuestionarios.html',
  styleUrls: ['./cuestionarios.scss']
})
export class Cuestionarios {

  // =============================
  // ESTADO GENERAL
  // =============================

  vistaActiva: 'lista' | 'historial' = 'lista';
  busqueda = '';
  filtroRol = 0;

  // MODALES
  modalNuevoCuestionario = false;
  modalEjecutar = false;
  modalDetalles = false;
  modalEditar = false;

  // EJECUCIÓN - PASO 1: Seleccionar Stakeholder
  stakeholderInput = '';
  mostrarFormularioNuevoStakeholder = false;
  nuevoStakeholderNombre = '';

  // EJECUCIÓN - PASO 2: Responder Preguntas
  respondiendo = false;
  respuestasActuales: string[] = [];
  indicePreguntaActual = 0;
  stakeholderSeleccionadoNombre = '';

  cuestionarioSeleccionado: Cuestionario | null = null;

  // NUEVO CUESTIONARIO
  nuevoCuestionario = this.crearCuestionarioVacio();
  tiposPreguntas = ['Abierta', 'Múltiple'];
  tipoPreguntatmp = 'abierta';
  nuevaPreguntaTexto = '';

  // =============================
  // DATOS MOCK
  // =============================

  roles: Rol[] = [];
  cuestionarios: Cuestionario[] = [];
  stakeholders: string[] = [];
  ejecuciones: EjecucionCuestionario[] = [];

  constructor() {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    // Los datos se cargarían desde el backend
    // Por ahora inicializamos arrays vacíos que se llenarán desde la BD
  }

  // =============================
  // GET FILTRADO
  // =============================

  get cuestionariosFiltrados(): Cuestionario[] {
    return this.cuestionarios.filter(c => {

      const coincideBusqueda =
        c.codigo.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        c.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        c.descripcion.toLowerCase().includes(this.busqueda.toLowerCase());

      const coincideRol =
        this.filtroRol === 0 || c.rol.id === this.filtroRol;

      return coincideBusqueda && coincideRol;
    });
  }

  // =============================
  // GETTERS ÚTILES
  // =============================

  get preguntaActual(): Pregunta | undefined {
    return this.cuestionarioSeleccionado?.preguntas[this.indicePreguntaActual];
  }

  get totalPreguntas(): number {
    return this.cuestionarioSeleccionado?.preguntas.length || 0;
  }

  get porcentajeProgreso(): number {
    if (!this.cuestionarioSeleccionado || this.totalPreguntas === 0) return 0;
    return ((this.indicePreguntaActual + 1) / this.totalPreguntas) * 100;
  }

  // =============================
  // MÉTODOS MODALES
  // =============================

  abrirNuevoCuestionario() {
    this.nuevoCuestionario = this.crearCuestionarioVacio();
    this.modalNuevoCuestionario = true;
  }

  abrirEjecutar(c: Cuestionario) {
    this.cuestionarioSeleccionado = c;
    this.modalEjecutar = true;
    this.respondiendo = false;
    this.stakeholderInput = '';
    this.respuestasActuales = [];
    this.indicePreguntaActual = 0;
  }

  abrirDetalles(c: Cuestionario) {
    this.cuestionarioSeleccionado = c;
    this.modalDetalles = true;
  }

  abrirEditar(c: Cuestionario) {
    this.cuestionarioSeleccionado = JSON.parse(JSON.stringify(c));
    this.modalEditar = true;
  }

  cerrarModales() {
    this.modalEjecutar = false;
    this.modalDetalles = false;
    this.modalEditar = false;
    this.modalNuevoCuestionario = false;
    this.respondiendo = false;
    this.mostrarFormularioNuevoStakeholder = false;
    this.nuevoStakeholderNombre = '';
  }

  // =============================
  // EJECUCIÓN - PASO 1: SELECCIONAR STAKEHOLDER
  // =============================

  comenzarEjecucion() {
    if (!this.stakeholderInput.trim() || !this.cuestionarioSeleccionado) return;

    this.stakeholderSeleccionadoNombre = this.stakeholderInput.trim();
    this.respuestasActuales = new Array(this.cuestionarioSeleccionado.preguntas.length).fill('');
    this.indicePreguntaActual = 0;
    this.respondiendo = true;
  }

  // =============================
  // EJECUCIÓN - PASO 2: RESPONDER PREGUNTAS
  // =============================

  irASiguientePregunta() {
    if (this.indicePreguntaActual < this.totalPreguntas - 1) {
      this.indicePreguntaActual++;
    }
  }

  irAAnteriorPregunta() {
    if (this.indicePreguntaActual > 0) {
      this.indicePreguntaActual--;
    }
  }

  finalizarRespuestas() {
    if (!this.cuestionarioSeleccionado) return;

    this.ejecuciones.push({
      id: Date.now(),
      cuestionarioId: this.cuestionarioSeleccionado.id,
      stakeholder: this.stakeholderSeleccionadoNombre,
      fecha: new Date().toLocaleString('es-ES'),
      respuestas: this.respuestasActuales
    });

    this.cuestionarioSeleccionado.aplicadoVeces++;
    this.cerrarModales();
  }

  // =============================
  // CREAR CUESTIONARIO
  // =============================

  crearCuestionarioVacio(): Partial<Cuestionario> {
    return {
      nombre: '',
      descripcion: '',
      rol: { id: 0, nombre: '' },
      preguntas: [],
      codigo: '',
      aplicadoVeces: 0,
      fechaCreacion: new Date().toLocaleDateString('es-ES')
    };
  }

  agregarPregunta() {
    if (!this.nuevaPreguntaTexto.trim()) return;

    const nuevaPregunta: Pregunta = {
      id: Date.now(),
      texto: this.nuevaPreguntaTexto.trim(),
      tipo: this.tipoPreguntatmp as 'abierta' | 'multiple'
    };

    (this.nuevoCuestionario.preguntas = this.nuevoCuestionario.preguntas || []).push(nuevaPregunta);
    this.nuevaPreguntaTexto = '';
  }

  eliminarPreguntaDelNuevo(index: number) {
    if (this.nuevoCuestionario.preguntas) {
      this.nuevoCuestionario.preguntas.splice(index, 1);
    }
  }

  guardarNuevoCuestionario() {
    if (!this.nuevoCuestionario.nombre || !this.nuevoCuestionario.descripcion) {
      alert('Por favor completa el nombre y descripción');
      return;
    }

    const cuestionario: Cuestionario = {
      id: Date.now(),
      nombre: this.nuevoCuestionario.nombre,
      descripcion: this.nuevoCuestionario.descripcion,
      codigo: `CUE-${Date.now().toString().slice(-4)}`,
      rol: this.nuevoCuestionario.rol || { id: 0, nombre: '' },
      preguntas: this.nuevoCuestionario.preguntas || [],
      aplicadoVeces: 0,
      fechaCreacion: new Date().toLocaleDateString('es-ES')
    };

    this.cuestionarios.push(cuestionario);
    this.cerrarModales();
  }

  // =============================
  // EDITAR Y ELIMINAR
  // =============================

  guardarEdicion() {
    if (!this.cuestionarioSeleccionado) return;

    const index =
      this.cuestionarios.findIndex(c => c.id === this.cuestionarioSeleccionado!.id);

    if (index !== -1) {
      this.cuestionarios[index] = this.cuestionarioSeleccionado as Cuestionario;
    }

    this.cerrarModales();
  }

  eliminarCuestionario(id: number) {
    this.cuestionarios = this.cuestionarios.filter(c => c.id !== id);
  }
}
