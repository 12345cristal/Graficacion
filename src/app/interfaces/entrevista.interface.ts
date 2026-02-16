/**
 * Interfaz que define la estructura de un Proyecto
 */
export interface Proyecto {
  id: number;
  nombre: string;
  descripcion?: string;
  fechaCreacion?: Date;
}

/**
 * Interfaz que define la estructura de una Entrevista
 */
export interface Entrevista {
  // Identificador único de la entrevista
  id: number;

  // Nombre o título de la entrevista
  nombre: string;

  // Descripción de la entrevista
  descripcion?: string;

  // ID del proyecto asociado
  proyectoId: number;

  // ID del stakeholder entrevistado
  stakeholderId?: number;

  // Estado de la entrevista (Pendiente, En curso, Completada)
  estado?: 'Pendiente' | 'En curso' | 'Completada';

  // Preguntas asociadas a la entrevista
  preguntas: Pregunta[];

  // Fecha de creación
  fechaCreacion?: Date;

  // Fecha de actualización
  fechaActualizacion?: Date;

  // Entrevistador responsable
  entrevistador?: string;
}

/**
 * Interfaz que define la estructura de una Pregunta
 */
export interface Pregunta {
  // Identificador único de la pregunta
  id: number;

  // Texto de la pregunta
  texto: string;

  // Orden de la pregunta en la entrevista
  orden: number;

  // Tipo de pregunta (Abierta, Cerrada, Escala, etc.)
  tipo?: 'Abierta' | 'Cerrada' | 'Escala' | 'Opción múltiple';

  // Respuesta asociada
  respuesta?: Respuesta;

  // Indica si es obligatoria
  obligatoria?: boolean;

  // Opciones para preguntas cerradas
  opciones?: string[];
}

/**
 * Interfaz que define la estructura de una Respuesta
 */
export interface Respuesta {
  // Identificador único de la respuesta
  id: number;

  // ID de la pregunta asociada
  preguntaId: number;

  // Contenido de la respuesta
  contenido: string;

  // Fecha de respuesta
  fechaRespuesta?: Date;

  // Comentarios adicionales
  comentarios?: string;

  // Calificación (para preguntas con escala)
  calificacion?: number;
}

/**
 * Interfaz que define la estructura de la Ejecución de una Entrevista
 */
export interface EjecucionEntrevista {
  // Identificador único de la ejecución
  id: number;

  // ID de la entrevista
  entrevistaId: number;

  // ID del stakeholder
  stakeholderId: number;

  // Estado actual (No iniciada, En curso, Finalizada)
  estado?: 'No iniciada' | 'En curso' | 'Finalizada';

  // Fecha de inicio
  fechaInicio?: Date;

  // Fecha de finalización
  fechaFinalizacion?: Date;

  // Respuestas recolectadas
  respuestas: Respuesta[];

  // Nombre del entrevistador
  entrevistador?: string;
}

/**
 * Interfaz para la respuesta de la API
 */
export interface RespuestaEntrevista {
  // Indicador de éxito
  exito: boolean;

  // Mensaje de respuesta
  mensaje: string;

  // Datos devueltos
  datos?: any;
}
