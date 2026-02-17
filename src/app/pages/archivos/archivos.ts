import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FileModel } from '../../interfaces/file.interface';

@Component({
  selector: 'app-archivos',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './archivos.html',
  styleUrl: './archivos.scss'
})
export class Archivos {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Lista de archivos cargados
  archivos: FileModel[] = [];
  searchText: string = '';
  cargando = false;
  errorMensaje = '';

  constructor() {
    this.cargarArchivosLocalStorage();
  }

  // Abrir diálogo de carga de archivos
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

    // Procesar cada archivo
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validar tipo de archivo
      if (!this.esArchivoValido(file)) {
        this.errorMensaje = `${file.name} no es un tipo de archivo válido`;
        continue;
      }

      // Validar tamaño (máximo 50MB)
      if (file.size > 50 * 1024 * 1024) {
        this.errorMensaje = `${file.name} excede el tamaño máximo de 50MB`;
        continue;
      }

      // Crear objeto FileModel
      const newFile: FileModel = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: this.getTipoArchivo(file.type),
        size: this.formatearTamanio(file.size),
        date: new Date().toISOString().split('T')[0],
        url: URL.createObjectURL(file)
      };

      this.archivos.unshift(newFile);
    }

    this.cargando = false;
    this.guardarArchivosLocalStorage();
    
    // Limpiar input
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
  getTipoArchivo(mimeType: string): 'pdf' | 'image' | 'document' {
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('image')) return 'image';
    return 'document';
  }

  // Formatear tamaño de archivo
  formatearTamanio(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  // Descargar archivo
  descargarArchivo(archivo: FileModel): void {
    const link = document.createElement('a');
    link.href = archivo.url;
    link.download = archivo.name;
    link.click();
  }

  // Eliminar archivo
  eliminarArchivo(id: number): void {
    this.archivos = this.archivos.filter(a => a.id !== id);
    this.guardarArchivosLocalStorage();
  }

  // Obtener icono según tipo
  getIconoTipo(tipo: string): string {
    switch (tipo) {
      case 'pdf': return 'picture_as_pdf';
      case 'image': return 'image';
      default: return 'description';
    }
  }

  // Obtener etiqueta tipo
  obtenerEtiqueta(tipo: string): string {
    switch (tipo) {
      case 'pdf': return 'PDF';
      case 'image': return 'Imagen';
      default: return 'Documento';
    }
  }

  // Obtener color según tipo
  getColorTipo(tipo: string): string {
    switch (tipo) {
      case 'pdf': return '#dc2626';
      case 'image': return '#0ea5e9';
      default: return '#6366f1';
    }
  }

  // Filtrar archivos por búsqueda
  get archivosFiltrados(): FileModel[] {
    if (!this.searchText.trim()) {
      return this.archivos;
    }
    return this.archivos.filter(a =>
      a.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // Guardar archivos en localStorage
  private guardarArchivosLocalStorage(): void {
    const datos = this.archivos.map(a => ({
      id: a.id,
      name: a.name,
      type: a.type,
      size: a.size,
      date: a.date
    }));
    localStorage.setItem('archivos_proyecto', JSON.stringify(datos));
  }

  // Cargar archivos desde localStorage
  private cargarArchivosLocalStorage(): void {
    const datos = localStorage.getItem('archivos_proyecto');
    if (datos) {
      try {
        const parsed = JSON.parse(datos);
        this.archivos = parsed.map((a: any) => ({
          ...a,
          url: '#' // Los archivos no se guardan en localStorage, solo metadatos
        }));
      } catch (e) {
        console.error('Error al cargar archivos', e);
      }
    }
  }
}
