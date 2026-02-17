import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { principal } from '../../interfaces/principal.interface';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatTooltipModule],
  templateUrl: './principal.html',
  styleUrls: ['./principal.scss'],
})
export class ProyectosComponent {
  private readonly KEY_STORAGE = 'requify_proyectos';

  proyectos = signal<principal[]>(this.cargarProyectos());

  estaModalAbierta = signal(false);
  estaCreando = signal(false);

  form: FormGroup;

  // Controls para el template
  nombreControl!: FormControl<string | null>;
  descripcionControl!: FormControl<string | null>;

  totalProyectos = computed(() => this.proyectos().length);

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      descripcion: ['', [Validators.maxLength(200)]],
    });

    this.nombreControl = this.form.get('nombre') as FormControl<string | null>;
    this.descripcionControl = this.form.get('descripcion') as FormControl<string | null>;
  }

  abrirModalCrear(): void {
    this.form.reset();
    this.estaModalAbierta.set(true);
  }

  cerrarModal(): void {
    this.estaModalAbierta.set(false);
  }

  crearProyecto(): void {
    if (this.form.invalid || this.estaCreando()) {
      this.form.markAllAsTouched();
      return;
    }

    this.estaCreando.set(true);

    const nombre = (this.form.value.nombre ?? '').trim();
    const descripcion = (this.form.value.descripcion ?? '').trim();

    const nuevo: principal = {
      id: this.crearIdSeguro(),
      nombre,
      descripcion,
      procesos: 0,
      stakeholders: 0,
      creadoEl: this.formatearFecha(new Date()),
    };

    const actualizados = [nuevo, ...this.proyectos()];
    this.proyectos.set(actualizados);
    this.guardarProyectos(actualizados);

    this.estaCreando.set(false);
    this.cerrarModal();
  }

  abrirProyecto(proyecto: principal): void {
    this.router.navigate(['/proyecto', proyecto.id]);
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }

  private crearIdSeguro(): string {
    const id = globalThis.crypto?.randomUUID?.();
    return id ?? this.idFallback();
  }

  private cargarProyectos(): principal[] {
    try {
      const raw = localStorage.getItem(this.KEY_STORAGE);
      if (!raw) return this.seed();
      const parsed = JSON.parse(raw) as principal[];
      return Array.isArray(parsed) ? parsed : this.seed();
    } catch {
      return this.seed();
    }
  }

  private guardarProyectos(lista: principal[]): void {
    try {
      localStorage.setItem(this.KEY_STORAGE, JSON.stringify(lista));
    } catch {
      // si falla, no rompas la app
    }
  }

  private seed(): principal[] {
    return [];
  }

  private formatearFecha(fecha: Date): string {
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const dd = String(fecha.getDate()).padStart(2, '0');
    const mm = meses[fecha.getMonth()];
    const yyyy = fecha.getFullYear();
    return `${dd} ${mm} ${yyyy}`;
  }

  private idFallback(): string {
    return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  onKeydownModal(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.cerrarModal();
  }
}
