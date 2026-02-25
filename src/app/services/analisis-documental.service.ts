import { Injectable } from '@angular/core';
import { DocumentoAnalisis, EstadisticasDocumentos } from '../interfaces/analisis-documental.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalisisDocumentalService {

  private documentosSubject = new BehaviorSubject<DocumentoAnalisis[]>([]);
  public documentos$: Observable<DocumentoAnalisis[]> = this.documentosSubject.asObservable();

  private estadisticasSubject = new BehaviorSubject<EstadisticasDocumentos>({
    totalCargado: '0 MB',
    cantidadDocumentos: 0,
    documentosPorTipo: { pdf: 0, imagen: 0, documento: 0 },
    ultimaCarga: 'Sin cargas'
  });
  public estadisticas$: Observable<EstadisticasDocumentos> = this.estadisticasSubject.asObservable();

  private tiposValidos = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ];

  constructor() {
    this.cargarDocumentosLocalStorage();
  }

  // Obtener documentos actuales
  obtenerDocumentos(): DocumentoAnalisis[] {
    return this.documentosSubject.value;
  }

  // Obtener estadísticas actuales
  obtenerEstadisticas(): EstadisticasDocumentos {
    return this.estadisticasSubject.value;
  }

  // Validar tipo de archivo
  esArchivoValido(file: File): boolean {
    return this.tiposValidos.includes(file.type);
  }

  // Obtener tipo de archivo
  getTipoArchivo(mimeType: string): 'pdf' | 'imagen' | 'documento' {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('image')) return 'imagen';
    return 'documento';
  }

  // Formatear tamaño
  formatearTamanio(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Parsear tamaño desde string
  parseSize(sizeStr: string): number {
    const parts = sizeStr.split(' ');
    const value = parseFloat(parts[0]);
    const unit = parts[1] || 'B';
    
    const multipliers: { [key: string]: number } = {
      'B': 1,
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024
    };
    
    return value * (multipliers[unit] || 1);
  }

  // Agregar documento
  agregarDocumento(file: File, categoria: string = 'General', descripcion: string = ''): DocumentoAnalisis {
    const nuevoDocumento: DocumentoAnalisis = {
      id: Date.now() + Math.random(),
      nombre: file.name,
      tipo: this.getTipoArchivo(file.type),
      tamanio: this.formatearTamanio(file.size),
      fechaCarga: new Date().toISOString().split('T')[0],
      url: URL.createObjectURL(file),
      descripcion: descripcion,
      categoria: categoria,
      estado: 'completado'
    };

    const documentos = [...this.documentosSubject.value];
    documentos.unshift(nuevoDocumento);
    this.documentosSubject.next(documentos);
    this.guardarDocumentosLocalStorage();
    this.actualizarEstadisticas();

    return nuevoDocumento;
  }

  // Eliminar documento
  eliminarDocumento(id: number): void {
    const documentos = this.documentosSubject.value.filter(doc => doc.id !== id);
    this.documentosSubject.next(documentos);
    this.guardarDocumentosLocalStorage();
    this.actualizarEstadisticas();
  }

  // Actualizar documento
  actualizarDocumento(id: number, cambios: Partial<DocumentoAnalisis>): void {
    const documentos = this.documentosSubject.value.map(doc =>
      doc.id === id ? { ...doc, ...cambios } : doc
    );
    this.documentosSubject.next(documentos);
    this.guardarDocumentosLocalStorage();
    this.actualizarEstadisticas();
  }

  // Actualizar estadísticas
  private actualizarEstadisticas(): void {
    const documentos = this.documentosSubject.value;
    const totalBytes = documentos.reduce((sum, doc) => sum + this.parseSize(doc.tamanio), 0);
    
    const estadisticas: EstadisticasDocumentos = {
      totalCargado: this.formatearTamanio(totalBytes),
      cantidadDocumentos: documentos.length,
      documentosPorTipo: {
        pdf: documentos.filter(d => d.tipo === 'pdf').length,
        imagen: documentos.filter(d => d.tipo === 'imagen').length,
        documento: documentos.filter(d => d.tipo === 'documento').length
      },
      ultimaCarga: documentos.length > 0 ? documentos[0].fechaCarga : 'Sin cargas'
    };

    this.estadisticasSubject.next(estadisticas);
  }

  // LocalStorage
  private guardarDocumentosLocalStorage(): void {
    localStorage.setItem('documentosAnalisis', JSON.stringify(this.documentosSubject.value));
  }

  private cargarDocumentosLocalStorage(): void {
    const datos = localStorage.getItem('documentosAnalisis');
    if (datos) {
      this.documentosSubject.next(JSON.parse(datos));
      this.actualizarEstadisticas();
    }
  }

  // Limpiar todo
  limpiarTodo(): void {
    this.documentosSubject.next([]);
    this.actualizarEstadisticas();
    localStorage.removeItem('documentosAnalisis');
  }
}
