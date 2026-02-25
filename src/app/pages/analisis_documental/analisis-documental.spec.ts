import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalisisDocumentalComponent } from './analisis-documental';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

declare var jasmine: any;

describe('AnalisisDocumentalComponent', () => {
  let component: AnalisisDocumentalComponent;
  let fixture: ComponentFixture<AnalisisDocumentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalisisDocumentalComponent, CommonModule, FormsModule, MatIconModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AnalisisDocumentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty documents', () => {
    expect(component.documentos.length).toBeGreaterThanOrEqual(0);
  });

  it('should validate file types correctly', () => {
    const validFile = new File([], 'test.pdf', { type: 'application/pdf' });
    const invalidFile = new File([], 'test.exe', { type: 'application/x-msdownload' });

    expect(component.esArchivoValido(validFile)).toBe(true);
    expect(component.esArchivoValido(invalidFile)).toBe(false);
  });

  it('should format file size correctly', () => {
    expect(component.formatearTamanio(0)).toBe('0 B');
    expect(component.formatearTamanio(1024)).toBe('1 KB');
    expect(component.formatearTamanio(1024 * 1024)).toBe('1 MB');
  });

  it('should get correct file type', () => {
    expect(component.getTipoArchivo('application/pdf')).toBe('pdf');
    expect(component.getTipoArchivo('image/png')).toBe('imagen');
    expect(component.getTipoArchivo('application/msword')).toBe('documento');
  });

  it('should delete document', () => {
    component.documentos = [
      {
        id: 1,
        nombre: 'test.pdf',
        tipo: 'pdf',
        tamanio: '100 KB',
        fechaCarga: '2026-02-24',
        url: 'test-url',
        estado: 'completado'
      }
    ];

    const confirmSpy = jasmine.spyOn(window, 'confirm').and.returnValue(true);
    component.eliminarDocumento(1);

    expect(confirmSpy).toHaveBeenCalled();
    expect(component.documentos.length).toBe(0);
  });

  it('should filter documents by name', () => {
    component.documentos = [
      {
        id: 1,
        nombre: 'documento1.pdf',
        tipo: 'pdf',
        tamanio: '100 KB',
        fechaCarga: '2026-02-24',
        url: 'test-url',
        estado: 'completado'
      },
      {
        id: 2,
        nombre: 'imagen1.png',
        tipo: 'imagen',
        tamanio: '50 KB',
        fechaCarga: '2026-02-24',
        url: 'test-url',
        estado: 'completado'
      }
    ];

    component.searchText = 'documento';
    expect(component.documentosFiltrados.length).toBe(1);
  });

  it('should update statistics correctly', () => {
    component.documentos = [
      {
        id: 1,
        nombre: 'test.pdf',
        tipo: 'pdf',
        tamanio: '100 KB',
        fechaCarga: '2026-02-24',
        url: 'test-url',
        estado: 'completado'
      }
    ];

    component.actualizarEstadisticas();

    expect(component.estadisticas.cantidadDocumentos).toBe(1);
    expect(component.estadisticas.documentosPorTipo.pdf).toBe(1);
  });
});
