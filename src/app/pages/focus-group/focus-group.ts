import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FocusGroup, Participante } from '../../interfaces/focus-group.interface';
import { EstadoFocusGroup } from '../../interfaces/estado-focus-group.interface';

@Component({
  selector: 'app-focus-group',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './focus-group.html',
  styleUrls: ['./focus-group.scss']
})
export class FocusGroupComponent {

  estado: EstadoFocusGroup = {
    modalCrearAbierto: false,
    modalEditarAbierto: false,
    focusSeleccionado: null
  };

  formulario: FocusGroup = this.crearFocusVacio();
  focusActual: FocusGroup | null = null;

  nuevoParticipante: Participante = {
    id: '',
    nombre: '',
    rol: ''
  };

  crearFocusVacio(): FocusGroup {
    return {
      id: '',
      nombre: '',
      descripcion: '',
      fecha: '',
      participantes: [],
      referenciaEntrevista: '',
      archivos: []
    };
  }

  abrirModalCrear(): void {
    this.formulario = this.crearFocusVacio();
    this.estado.modalCrearAbierto = true;
  }

  abrirModalEditar(): void {
    if (!this.focusActual) return;

    this.formulario = { ...this.focusActual };
    this.estado.modalEditarAbierto = true;
  }

  guardarFocus(): void {

    if (!this.formulario.nombre || !this.formulario.descripcion) {
      alert('Nombre y descripción son obligatorios.');
      return;
    }

    if (!this.focusActual) {
      this.formulario.id = this.generarId();
      this.formulario.fecha = this.obtenerFecha();
      this.focusActual = { ...this.formulario };
    } else {
      this.focusActual = { ...this.formulario };
    }

    this.cerrarModales();
  }

  eliminarFocus(): void {
    this.focusActual = null;
  }

  cerrarModales(): void {
    this.estado.modalCrearAbierto = false;
    this.estado.modalEditarAbierto = false;
  }

  agregarParticipante(): void {

    if (!this.nuevoParticipante.nombre || !this.nuevoParticipante.rol) {
      return;
    }

    const participante: Participante = {
      id: this.generarId(),
      nombre: this.nuevoParticipante.nombre,
      rol: this.nuevoParticipante.rol
    };

    this.formulario.participantes.push(participante);

    this.nuevoParticipante = { id: '', nombre: '', rol: '' };
  }

  eliminarParticipante(index: number): void {
    this.formulario.participantes.splice(index, 1);
  }

  manejarArchivos(event: any): void {
    this.formulario.archivos = Array.from(event.target.files);
  }

  generarId(): string {
    return `FG-${Math.floor(Math.random() * 1000)}`;
  }

  obtenerFecha(): string {
    return new Date().toISOString().split('T')[0];
  }
}
