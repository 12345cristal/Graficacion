// modelos/focus-group.interface.ts

export interface Participante {
  id: string;
  nombre: string;
  rol: string;
}

export interface FocusGroup {
  id: string;
  nombre: string;
  descripcion: string;
  fecha: string;
  participantes: Participante[];
  referenciaEntrevista?: string;
  archivos: File[];
}
