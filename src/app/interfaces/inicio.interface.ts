// modelos/dashboard.interface.ts

export interface TarjetaResumen {
  titulo: string;
  cantidad: number;
  icono: string;
  colorFondo: string;
}

export interface ActividadReciente {
  titulo: string;
  descripcion: string;
  fechaTexto: string;
  icono: string;
  color: string;
}

export interface ProyectoActual {
  nombre: string;
  descripcion: string;
  procesos: number;
  stakeholders: number;
  fechaCreacion: string;
}
