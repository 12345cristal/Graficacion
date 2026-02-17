import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Entrevista } from '../../interfaces/entrevista.interface';
import { Pregunta } from '../../interfaces/pregunta.interface';
import { Ejecucion, Respuesta } from '../../interfaces/ejecucion.interface';
import { Stakeholder } from '../../interfaces/stackeholders.interface';

@Component({
  selector: 'app-entrevistas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entrevistas.html',
  styleUrls: ['./entrevistas.scss']
})
export class EntrevistasComponent {

  vistaActiva: 'entrevistas' | 'historial' | 'detalles' = 'entrevistas';
  modalAbierto = false;
  modalEjecucionAbierto = false;
  modalDetallesAbierto = false;
  busqueda = '';

  // Entrevistas
  entrevistas: Entrevista[] = [];
  editandoEntrevistaId: number | null = null;

  // Historial
  historial: Ejecucion[] = [];
  detallesEjecucion: Ejecucion | null = null;

  // Modal de nueva entrevista
  nuevaEntrevista: Entrevista = this.crearEntrevistaVacia();

  // Modal de ejecución
  entrevistaAEjecutar: Entrevista | null = null;
  stakeholders: Stakeholder[] = [
    { id: '1', nombre: 'Juan Pérez', rolId: 'po', descripcion: 'Product Owner' },
    { id: '2', nombre: 'María García', rolId: 'dev', descripcion: 'Developer' }
  ];
  stakeholderSeleccionado: string = '';
  nuevoStakeholder: string = '';
  
  // Propiedades para responder preguntas
  respondiendo = false;
  respuestasActuales: Respuesta[] = [];
  indicePreguntaActual = 0;
  stakeholderSeleccionadoNombre = '';

  cambiarVista(vista: 'entrevistas' | 'historial' | 'detalles'): void {
    this.vistaActiva = vista;
  }

  abrirModal(): void {
    this.editandoEntrevistaId = null;
    this.nuevaEntrevista = this.crearEntrevistaVacia();
    this.modalAbierto = true;
  }

  abrirModalEditar(entrevista: Entrevista): void {
    this.editandoEntrevistaId = entrevista.id;
    this.nuevaEntrevista = JSON.parse(JSON.stringify(entrevista));
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.editandoEntrevistaId = null;
    this.nuevaEntrevista = this.crearEntrevistaVacia();
  }

  crearEntrevistaVacia(): Entrevista {
    return {
      id: 0,
      nombre: '',
      preguntas: [{ id: 0, texto: '', tipo: 'abierta' }],
      fechaCreacion: new Date().toISOString()
    };
  }

  agregarPregunta(): void {
    this.nuevaEntrevista.preguntas.push({ id: Date.now(), texto: '', tipo: 'abierta' });
  }

  eliminarPregunta(index: number): void {
    if (this.nuevaEntrevista.preguntas.length > 1) {
      this.nuevaEntrevista.preguntas.splice(index, 1);
    }
  }

  guardarEntrevista(): void {
    if (!this.nuevaEntrevista.nombre.trim()) return;

    const preguntasValidas: Pregunta[] =
      this.nuevaEntrevista.preguntas
        .filter((p: Pregunta) => p.texto.trim() !== '');

    if (!preguntasValidas.length) return;

    const entrevista: Entrevista = {
      ...this.nuevaEntrevista,
      id: this.editandoEntrevistaId || Date.now(),
      preguntas: preguntasValidas
    };

    if (this.editandoEntrevistaId) {
      // Editar
      this.entrevistas = this.entrevistas.map(e => 
        e.id === this.editandoEntrevistaId ? entrevista : e
      );
    } else {
      // Crear nueva
      this.entrevistas = [...this.entrevistas, entrevista];
    }

    this.cerrarModal();
  }

  abrirModalEjecucion(entrevista: Entrevista): void {
    this.entrevistaAEjecutar = entrevista;
    this.stakeholderSeleccionado = '';
    this.nuevoStakeholder = '';
    this.modalEjecucionAbierto = true;
  }

  cerrarModalEjecucion(): void {
    this.modalEjecucionAbierto = false;
    this.respondiendo = false;
    this.entrevistaAEjecutar = null;
    this.stakeholderSeleccionado = '';
    this.nuevoStakeholder = '';
    this.respuestasActuales = [];
    this.indicePreguntaActual = 0;
  }

  comenzarEntrevista(): void {
    if (!this.entrevistaAEjecutar) return;

    let stakeholderNombre = '';
    let stakeholderId = '';

    if (this.nuevoStakeholder.trim()) {
      stakeholderNombre = this.nuevoStakeholder.trim();
      stakeholderId = `new-${Date.now()}`;
    } else if (this.stakeholderSeleccionado) {
      const sh = this.stakeholders.find(s => s.id === this.stakeholderSeleccionado);
      if (sh) {
        stakeholderNombre = sh.nombre;
        stakeholderId = sh.id;
      }
    }

    if (!stakeholderNombre) return;

    // Inicializar respuestas vacías
    this.respuestasActuales = this.entrevistaAEjecutar.preguntas.map(p => ({
      preguntaTexto: p.texto,
      respuesta: ''
    }));

    this.stakeholderSeleccionadoNombre = stakeholderNombre;
    this.indicePreguntaActual = 0;
    this.respondiendo = true;
  }

  irASiguientePregunta(): void {
    if (this.indicePreguntaActual < this.respuestasActuales.length - 1) {
      this.indicePreguntaActual++;
    }
  }

  irAAnteriorPregunta(): void {
    if (this.indicePreguntaActual > 0) {
      this.indicePreguntaActual--;
    }
  }

  finalizarRespuestas(): void {
    if (!this.entrevistaAEjecutar) return;

    let stakeholderId = '';
    if (this.nuevoStakeholder.trim()) {
      stakeholderId = `new-${Date.now()}`;
    } else if (this.stakeholderSeleccionado) {
      stakeholderId = this.stakeholderSeleccionado;
    }

    const nuevoFolio = `FOL-${String(this.historial.length + 1).padStart(3, '0')}`;
    
    const ejecucion: Ejecucion = {
      folio: nuevoFolio,
      entrevista: this.entrevistaAEjecutar.nombre,
      entrevistaId: this.entrevistaAEjecutar.id,
      responsable: 'Usuario Actual',
      stakeholder: this.stakeholderSeleccionadoNombre,
      stakeholderId: stakeholderId,
      fecha: new Date().toLocaleString('es-ES'),
      respuestas: this.respuestasActuales
    };

    this.historial = [ejecucion, ...this.historial];
    this.cerrarModalEjecucion();
    this.vistaActiva = 'historial';
  }

  get preguntaActual(): Respuesta | null {
    return this.respuestasActuales[this.indicePreguntaActual] || null;
  }

  get totalPreguntas(): number {
    return this.respuestasActuales.length;
  }

  verDetallesEjecucion(ejecucion: Ejecucion): void {
    this.detallesEjecucion = ejecucion;
    this.modalDetallesAbierto = true;
  }

  cerrarModalDetalles(): void {
    this.modalDetallesAbierto = false;
    this.detallesEjecucion = null;
  }

  eliminarEntrevista(id: number): void {
    this.entrevistas = this.entrevistas.filter(e => e.id !== id);
  }

  get entrevistasFiltradas(): Entrevista[] {
    return this.entrevistas.filter(e =>
      e.nombre.toLowerCase()
        .includes(this.busqueda.toLowerCase())
    );
  }
}
