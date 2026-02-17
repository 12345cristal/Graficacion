import { Pregunta } from './pregunta.interface';
import { Rol } from './rol.interface';

export interface Cuestionario {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  rol: Rol;
  proyecto?: string;
  preguntas: Pregunta[];
  fechaCreacion: string;
  aplicadoVeces: number;
}
