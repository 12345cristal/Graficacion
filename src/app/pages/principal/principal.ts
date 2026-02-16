import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

type RolUsuario = 'Analista' | 'Administrador';

interface UsuarioSesion {
  nombre: string;
  rol: RolUsuario;
}

interface ProyectoResumen {
  id: string;
  nombre: string;
  descripcion: string;
  procesos: number;
  stakeholders: number;
  creadoEl: string; // dd MMM yyyy
}

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './principal.html',
  styleUrls: ['./principal.scss'],
})
export class ProyectosComponent {
  private readonly KEY_STORAGE = 'requify_proyectos';


  proyectos = signal<ProyectoResumen[]>(this.cargarProyectos());

  estaModalAbierta = signal(false);
  estaCreando = signal(false);

  form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    descripcion: ['', [Validators.maxLength(200)]],
  });

  totalProyectos = computed(() => this.proyectos().length);

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  abrirModalCrear(): void {
    this.form.reset();
    this.estaModalAbierta.set(true);
    // Opcional: enfocar input con setTimeout (sin tocar DOM directo aquí)
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

    const nuevo: ProyectoResumen = {
      id: crypto?.randomUUID ? crypto.randomUUID() : this.idFallback(),
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

  abrirProyecto(proyecto: ProyectoResumen): void {
    // Ruta destino: donde tienes el LayoutComponent
    // Ejemplo: /proyecto/:id  (ajústalo a tu routing real si difiere)
    this.router.navigate(['/proyecto', proyecto.id]);
  }

  cerrarSesion(): void {
    // Aquí normalmente llamarías tu AuthService y limpiarías tokens.
    // Ejemplo simple:
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }

  // =========================
  // Storage local (demo útil)
  // =========================
  private cargarProyectos(): ProyectoResumen[] {
    try {
      const raw = localStorage.getItem(this.KEY_STORAGE);
      if (!raw) return this.seed();
      const parsed = JSON.parse(raw) as ProyectoResumen[];
      return Array.isArray(parsed) ? parsed : this.seed();
    } catch {
      return this.seed();
    }
  }

  private guardarProyectos(lista: ProyectoResumen[]): void {
    try {
      localStorage.setItem(this.KEY_STORAGE, JSON.stringify(lista));
    } catch {
      // si falla, no rompas la app
    }
  }

  private seed(): ProyectoResumen[] {
    // Puedes dejarlo vacío si no quieres ejemplo
    return [
      {
        id: 'demo-1',
        nombre: 'cristal',
        descripcion: 'ecece',
        procesos: 0,
        stakeholders: 0,
        creadoEl: this.formatearFecha(new Date()),
      },
    ];
  }

  private formatearFecha(fecha: Date): string {
    // “16 feb 2026” estilo simple en español
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const dd = String(fecha.getDate()).padStart(2, '0');
    const mm = meses[fecha.getMonth()];
    const yyyy = fecha.getFullYear();
    return `${dd} ${mm} ${yyyy}`;
  }

  private idFallback(): string {
    return `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  // UX: cerrar modal con tecla ESC (si quieres)
  onKeydownModal(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.cerrarModal();
  }
}
