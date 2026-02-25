import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DocumentoAnalisis, EstadisticasDocumentos, ResumenAnalisis } from '../../interfaces/analisis-documental.interface';

@Component({
  selector: 'app-analisis-documental',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './analisis-documental.html',
  styleUrl: './analisis-documental.scss'
})
export class AnalisisDocumentalComponent {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  documentos: DocumentoAnalisis[] = [];
  searchText: string = '';
  filtroCategoria: string = '';
  cargando = false;
  errorMensaje = '';
  categorias: string[] = [];

  estadisticas: EstadisticasDocumentos = {
    totalCargado: '0 MB',
    cantidadDocumentos: 0,
    documentosPorTipo: {
      pdf: 0,
      imagen: 0,
      documento: 0
    },
    ultimaCarga: 'Sin cargas'
  };

  constructor() {
    this.cargarDocumentosLocalStorage();
    this.actualizarEstadisticas();
  }

  // Abrir selector de archivos
  abrirSelectorArchivos() {
    this.fileInput.nativeElement.click();
  }

  // Manejar selección de archivos
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) return;

    this.cargando = true;
    this.errorMensaje = '';

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validar tipo de archivo
      if (!this.esArchivoValido(file)) {
        this.errorMensaje = `${file.name} no es un tipo válido`;
        continue;
      }

      // Validar tamaño (máximo 100MB)
      if (file.size > 100 * 1024 * 1024) {
        this.errorMensaje = `${file.name} excede el tamaño máximo de 100MB`;
        continue;
      }

      // Crear documento
      const nuevoDocumento: DocumentoAnalisis = {
        id: Date.now() + Math.random(),
        nombre: file.name,
        tipo: this.getTipoArchivo(file.type),
        tamanio: this.formatearTamanio(file.size),
        fechaCarga: new Date().toISOString().split('T')[0],
        url: URL.createObjectURL(file),
        descripcion: '',
        categoria: 'General',
        estado: 'completado'
      };

      this.documentos.unshift(nuevoDocumento);
    }

    this.cargando = false;
    this.actualizarEstadisticas();
    this.guardarDocumentosLocalStorage();
    input.value = '';
  }

  // Validar tipo de archivo
  esArchivoValido(file: File): boolean {
    const tiposValidos = [
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
    return tiposValidos.includes(file.type);
  }

  // Obtener tipo de archivo
  getTipoArchivo(mimeType: string): 'pdf' | 'imagen' | 'documento' {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('image')) return 'imagen';
    return 'documento';
  }

  // Formatear tamaño de archivo
  formatearTamanio(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Obtener documentos filtrados
  get documentosFiltrados(): DocumentoAnalisis[] {
    return this.documentos.filter(doc => {
      const coincideNombre = doc.nombre.toLowerCase().includes(this.searchText.toLowerCase());
      const coincideCategoria = this.filtroCategoria === '' || doc.categoria === this.filtroCategoria;
      return coincideNombre && coincideCategoria;
    });
  }

  // Obtener icono según tipo de archivo
  obtenerIcono(tipo: string): string {
    const iconos: { [key: string]: string } = {
      'pdf': 'description',
      'imagen': 'image',
      'documento': 'article'
    };
    return iconos[tipo] || 'file_present';
  }

  // Eliminar documento
  eliminarDocumento(id: number) {
    if (confirm('¿Está seguro de que desea eliminar este documento?')) {
      this.documentos = this.documentos.filter(doc => doc.id !== id);
      this.actualizarEstadisticas();
      this.guardarDocumentosLocalStorage();
    }
  }

  // Actualizar estadísticas
  actualizarEstadisticas() {
    const totalBytes = this.documentos.reduce((sum, doc) => sum + this.parseSize(doc.tamanio), 0);
    
    this.estadisticas = {
      totalCargado: this.formatearTamanio(totalBytes),
      cantidadDocumentos: this.documentos.length,
      documentosPorTipo: {
        pdf: this.documentos.filter(d => d.tipo === 'pdf').length,
        imagen: this.documentos.filter(d => d.tipo === 'imagen').length,
        documento: this.documentos.filter(d => d.tipo === 'documento').length
      },
      ultimaCarga: this.documentos.length > 0 ? this.documentos[0].fechaCarga : 'Sin cargas'
    };

    this.extraerCategorias();
  }

  // Extraer categorías únicas
  extraerCategorias() {
    const cats = new Set<string>();
    this.documentos.forEach(doc => {
      if (doc.categoria) cats.add(doc.categoria);
    });
    this.categorias = Array.from(cats);
  }

  // Parsear tamaño de string
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

  // Descargar documento
  descargarDocumento(documento: DocumentoAnalisis) {
    const link = document.createElement('a');
    link.href = documento.url;
    link.download = documento.nombre;
    link.click();
  }

  // LocalStorage
  guardarDocumentosLocalStorage() {
    localStorage.setItem('documentosAnalisis', JSON.stringify(this.documentos));
  }

  cargarDocumentosLocalStorage() {
    const datos = localStorage.getItem('documentosAnalisis');
    if (datos) {
      this.documentos = JSON.parse(datos);
    }
  }
}
