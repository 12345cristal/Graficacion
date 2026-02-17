export type TipoPregunta = 'abierta' | 'multiple';

export interface Pregunta {
  id: number;
  texto: string;
  tipo: TipoPregunta;
}
