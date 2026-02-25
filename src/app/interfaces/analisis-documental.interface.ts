// Interfaz para documentos en análisis documental
export interface DocumentoAnalisis {
  id: number;
  nombre: string;
  tipo: 'pdf' | 'imagen' | 'documento';
  tamanio: string;
  fechaCarga: string;
  url: string;
  descripcion?: string;
  categoria?: string;
  estado: 'procesando' | 'completado' | 'error';
}

// Interfaz para resumen del análisis
export interface ResumenAnalisis {
  totalDocumentos: number;
  documentosProcesados: number;
  documentosPendientes: number;
  categorias: string[];
}

// Interfaz para resultado del análisis
export interface ResultadoAnalisis {
  id: number;
  documentoId: number;
  resumen: string;
  palabrasClave: string[];
  fechaAnalisis: string;
  relevancia: number;
}

// Interfaz para estadísticas de documentos
export interface EstadisticasDocumentos {
  totalCargado: string;
  cantidadDocumentos: number;
  documentosPorTipo: {
    pdf: number;
    imagen: number;
    documento: number;
  };
  ultimaCarga: string;
  tamanioTotal?: string;
}
