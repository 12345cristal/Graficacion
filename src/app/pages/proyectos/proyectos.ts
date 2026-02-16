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

  modalAbierto = false;
  intentoEnvio = false; // 👈 controla si ya intentó guardar
  mensajeError = '';
  mensajeExito = '';

  nuevoProyecto = {
    empresa: '',
    nombre: '',
    descripcion: ''
  };

  ultimoProyectoId: number | null = null;

  abrirModal() {
    this.modalAbierto = true;
    this.intentoEnvio = false;
    this.mensajeError = '';
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.resetFormulario();
  }

  resetFormulario() {
    this.nuevoProyecto = {
      empresa: '',
      nombre: '',
      descripcion: ''
    };
    this.intentoEnvio = false;
  }

  campoInvalido(campo: string): boolean {
    return this.intentoEnvio && !campo.trim();
  }

  formularioValido(): boolean {
    return (
      this.nuevoProyecto.empresa.trim() !== '' &&
      this.nuevoProyecto.nombre.trim() !== '' &&
      this.nuevoProyecto.descripcion.trim() !== ''
    );
  }

  guardarProyecto() {

    this.intentoEnvio = true;

    if (!this.formularioValido()) {
      this.mensajeError = 'Rellene todos los campos obligatorios';
      return;
    }

    const proyecto: Proyecto = {
      id: this.proyectos.length + 1,
      nombre: this.nuevoProyecto.nombre,
      descripcion: this.nuevoProyecto.descripcion
    };

    this.proyectos.push(proyecto);
    this.ultimoProyectoId = proyecto.id;

    this.mensajeExito = 'Proyecto creado correctamente ✔';
    this.mensajeError = '';

    setTimeout(() => {
      this.mensajeExito = '';
      this.ultimoProyectoId = null;
    }, 3000);

    this.cerrarModal();
  }

  get proyectosFiltrados(): Proyecto[] {
    return this.proyectos.filter(p =>
      p.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase())
    );
  }
}
