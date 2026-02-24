// modelos/observacion.interface.ts

export interface Observacion {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  referenciaEntrevista?: string;
  referenciaCuestionario?: string;
  archivos: File[];
}
