// Interfaz que define la estructura de un Proyecto
export interface Proyecto {

  // Identificador único del proyecto
  id: number;

  // Nombre del proyecto
  nombre: string;

  // Descripción general
  descripcion: string;

  // Fecha de creación
  fechaCreacion?: Date;

  // Estado del proyecto (Activo, Finalizado, En progreso)
  estado?: string;

}
