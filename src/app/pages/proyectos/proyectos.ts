import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Proyecto } from '../../interfaces/proyecto.interface';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proyectos.html',
  styleUrls: ['./proyectos.scss']
})
export class ProyectosComponent {

  proyectos: Proyecto[] = [];
  textoBusqueda: string = '';

  // CONTROL MODAL
  modalAbierto: boolean = false;

  // MODELO TEMPORAL
  nuevoProyecto: Partial<Proyecto> = {
    nombre: '',
    descripcion: ''
  };

  abrirModal() {
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.nuevoProyecto = { nombre: '', descripcion: '' };
  }

  guardarProyecto() {

    if (!this.nuevoProyecto.nombre) return;

    const proyecto: Proyecto = {
      id: this.proyectos.length + 1,
      nombre: this.nuevoProyecto.nombre!,
      descripcion: this.nuevoProyecto.descripcion || ''
    };

    this.proyectos.push(proyecto);
    this.cerrarModal();
  }

  get proyectosFiltrados(): Proyecto[] {
    return this.proyectos.filter(p =>
      p.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase())
    );
  }
}
