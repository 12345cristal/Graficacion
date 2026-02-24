import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarjetaResumen, ActividadReciente, ProyectoActual } from '../../interfaces/inicio.interface';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.scss']
})
export class Inicio {

  fechaActual: string = this.obtenerFecha();

  usuarioNombre: string = 'mario';
  proyectoNombre: string = 'b gfn';

  // Tarjetas individuales (sin arrays)
  procesos: TarjetaResumen = {
    titulo: 'Procesos',
    cantidad: 0,
    icono: 'settings',
    colorFondo: '#ede9fe'
  };

  stakeholders: TarjetaResumen = {
    titulo: 'Stakeholders',
    cantidad: 0,
    icono: 'groups',
    colorFondo: '#dbeafe'
  };

  roles: TarjetaResumen = {
    titulo: 'Roles Definidos',
    cantidad: 0,
    icono: 'sell',
    colorFondo: '#dcfce7'
  };

  entrevistas: TarjetaResumen = {
    titulo: 'Entrevistas',
    cantidad: 0,
    icono: 'chat',
    colorFondo: '#fed7aa'
  };

  cuestionarios: TarjetaResumen = {
    titulo: 'Cuestionarios',
    cantidad: 0,
    icono: 'quiz',
    colorFondo: '#fde68a'
  };

  historias: TarjetaResumen = {
    titulo: 'Historias de Usuario',
    cantidad: 0,
    icono: 'menu_book',
    colorFondo: '#e0e7ff'
  };

  observaciones: TarjetaResumen = {
    titulo: 'Observaciones',
    cantidad: 0,
    icono: 'visibility',
    colorFondo: '#fbcfe8'
  };

  focus: TarjetaResumen = {
    titulo: 'Focus Groups',
    cantidad: 0,
    icono: 'record_voice_over',
    colorFondo: '#ccfbf1'
  };

  actividad1: ActividadReciente = {
    titulo: 'Proyecto creado',
    descripcion: 'b gfn',
    fechaTexto: 'Hoy',
    icono: 'check_circle',
    color: '#22c55e'
  };

  actividad2: ActividadReciente = {
    titulo: 'Usuario registrado',
    descripcion: 'mario',
    fechaTexto: 'Hoy',
    icono: 'person',
    color: '#3b82f6'
  };

  proyectoActual: ProyectoActual = {
    nombre: 'b gfn',
    descripcion: '',
    procesos: 0,
    stakeholders: 0,
    fechaCreacion: '17/2/2026'
  };

  obtenerFecha(): string {
    const fecha = new Date();
    return fecha.toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
}
