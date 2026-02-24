import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observacion } from '../../interfaces/observacion.interface';
import { EstadoObservaciones } from '../../interfaces/estado-observaciones.interface';

@Component({
  selector: 'app-observaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './observaciones.html',
  styleUrls: ['./observaciones.scss']
})
export class Observaciones {

  estado: EstadoObservaciones = {
    modalCrearAbierto: false,
    modalEditarAbierto: false,
    observacionSeleccionada: null
  };

  formulario: Observacion = this.crearObservacionVacia();

  observacionActual: Observacion | null = null;

  crearObservacionVacia(): Observacion {
    return {
      id: '',
      titulo: '',
      descripcion: '',
      fecha: '',
      referenciaEntrevista: '',
      referenciaCuestionario: '',
      archivos: []
    };
  }

  abrirModalCrear(): void {
    this.formulario = this.crearObservacionVacia();
    this.estado.modalCrearAbierto = true;
  }

  abrirModalEditar(): void {
    if (!this.observacionActual) return;

    this.formulario = { ...this.observacionActual };
    this.estado.modalEditarAbierto = true;
  }

  guardarObservacion(): void {

    if (!this.formulario.titulo || !this.formulario.descripcion) {
      alert('Título y descripción son obligatorios.');
      return;
    }

    if (!this.observacionActual) {
      this.formulario.id = this.generarId();
      this.formulario.fecha = this.obtenerFechaActual();
      this.observacionActual = { ...this.formulario };
    } else {
      this.observacionActual = { ...this.formulario };
    }

    this.cerrarModales();
  }

  eliminarObservacion(): void {
    this.observacionActual = null;
  }

  cerrarModales(): void {
    this.estado.modalCrearAbierto = false;
    this.estado.modalEditarAbierto = false;
  }

  generarId(): string {
    return `OBS-${Math.floor(Math.random() * 1000)}`;
  }

  obtenerFechaActual(): string {
    return new Date().toISOString().split('T')[0];
  }

  manejarArchivos(event: any): void {
    const archivosSeleccionados = event.target.files;
    this.formulario.archivos = Array.from(archivosSeleccionados);
  }
}
