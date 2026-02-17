import { Pregunta } from './pregunta.interface';

export interface Entrevista {
  id: number;
  nombre: string;
  preguntas: Pregunta[];
  fechaCreacion?: string;   // opcional para auditoría futura
}
