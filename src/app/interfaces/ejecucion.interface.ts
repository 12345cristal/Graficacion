export interface Respuesta {
  preguntaTexto: string;
  respuesta: string;
}

export interface Ejecucion {
  folio: string;
  entrevista: string;     // nombre de la entrevista
  entrevistaId: number;   // id de la entrevista
  responsable: string;
  stakeholder: string;    // nombre del stakeholder
  stakeholderId: string;  // id del stakeholder
  fecha: string;
  respuestas?: Respuesta[];
}
