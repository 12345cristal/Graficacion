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

  modalEjecutar = false;
  modalDetalles = false;
  modalEditar = false;
  stakeholderInput = '';

  cuestionarioSeleccionado: Cuestionario | null = null;

  // =============================
  // DATOS MOCK
  // =============================

  roles: Rol[] = [];

  cuestionarios: Cuestionario[] = [];

  ejecuciones: EjecucionCuestionario[] = [];
  roles: Rol[] = [];

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
  // MODALES
  // =============================

  abrirEjecutar(c: Cuestionario) {
    this.cuestionarioSeleccionado = c;
    this.modalEjecutar = true;
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
  }

  ejecutarCuestionario(stakeholder: string) {
    if (!stakeholder.trim()) return;

    this.ejecuciones.push({
      id: Date.now(),
      cuestionarioId: this.cuestionarioSeleccionado.id,
      stakeholder,
      fecha: new Date().toISOString()
    });

    this.cuestionarioSeleccionado.aplicadoVeces++;
    this.cerrarModales();
  }

  eliminarCuestionario(id: number) {
    this.cuestionarios =
      this.cuestionarios.filter(c => c.id !== id);
  }

  guardarEdicion() {
    const index =
      this.cuestionarios.findIndex(c => c.id === this.cuestionarioSeleccionado.id);

    if (index !== -1) {
      this.cuestionarios[index] = this.cuestionarioSeleccionado;
    }

    this.cerrarModales();
  }
}
