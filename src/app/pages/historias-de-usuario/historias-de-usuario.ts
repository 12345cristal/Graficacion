import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoriaUsuario } from '../../interfaces/historia-usuario.interface';
import { EstadoHistorias } from '../../interfaces/estado-historias.interface';

@Component({
  selector: 'app-historias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historias-de-usuario.html',
  styleUrls: ['./historias-de-usuario.scss']
})
export class HistoriasDeUsuario {

  // ================================
  // Estado del componente
  // ================================
  estado: EstadoHistorias = {
    modalCrearAbierto: false,
    modalEditarAbierto: false,
    historiaSeleccionada: null
  };

  // ================================
  // Modelo del formulario
  // ================================
  formulario: HistoriaUsuario = this.crearHistoriaVacia();

  // ================================
  // Historia actual (sin mock)
  // ================================
  historiaActual: HistoriaUsuario | null = null;

  // ================================
  // Crear estructura limpia
  // ================================
  crearHistoriaVacia(): HistoriaUsuario {
    return {
      id: '',
      rol: '',
      funcionalidad: '',
      beneficio: '',
      prioridad: 'Media',
      estado: 'Pendiente',
      criteriosAceptacion: ''
    };
  }

  // ================================
  // Abrir modal crear
  // ================================
  abrirModalCrear(): void {
    this.formulario = this.crearHistoriaVacia();
    this.estado.modalCrearAbierto = true;
  }

  // ================================
  // Abrir modal editar
  // ================================
  abrirModalEditar(): void {
    if (!this.historiaActual) return;

    this.formulario = { ...this.historiaActual };
    this.estado.modalEditarAbierto = true;
  }

  // ================================
  // Guardar historia
  // ================================
  guardarHistoria(): void {

    if (!this.formulario.rol ||
        !this.formulario.funcionalidad ||
        !this.formulario.beneficio) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    if (!this.historiaActual) {
      this.formulario.id = this.generarId();
      this.historiaActual = { ...this.formulario };
    } else {
      this.historiaActual = { ...this.formulario };
    }

    this.cerrarModales();
  }

  // ================================
  // Eliminar historia
  // ================================
  eliminarHistoria(): void {
    this.historiaActual = null;
  }

  // ================================
  // Cerrar modales
  // ================================
  cerrarModales(): void {
    this.estado.modalCrearAbierto = false;
    this.estado.modalEditarAbierto = false;
  }

  // ================================
  // Generador de ID
  // ================================
  generarId(): string {
    const numero = Math.floor(Math.random() * 1000);
    return `HU-${numero}`;
  }

  // ================================
  // Clases dinámicas
  // ================================
  obtenerClasePrioridad(prioridad: string): string {
    return prioridad.toLowerCase();
  }

  obtenerClaseEstado(estado: string): string {
    return estado.replace(' ', '-').toLowerCase();
  }
}
