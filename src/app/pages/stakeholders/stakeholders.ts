import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Rol } from '../../interfaces/rol.interface';
import { Stakeholder } from '../../interfaces/stackeholders.interface';

type TabStakeholders = 'stakeholders' | 'roles';

@Component({
  selector: 'app-stakeholders',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './stakeholders.html',
  styleUrls: ['./stakeholders.scss'],
})
export class StakeholdersComponent {
  private readonly KEY_STAKEHOLDERS = 'requify_stakeholders';
  private readonly KEY_ROLES = 'requify_roles';

  tabActiva = signal<TabStakeholders>('stakeholders');
  busqueda = signal<string>('');

  roles = signal<Rol[]>(this.cargarRoles());
  stakeholders = signal<Stakeholder[]>(this.cargarStakeholders());

  modalStakeholderAbierto = signal(false);
  modalRolAbierto = signal(false);

  editandoStakeholderId = signal<string | null>(null);
  editandoRolId = signal<number | null>(null);

  stakeholderForm: any;
  rolForm: any;

  constructor(private fb: FormBuilder) {
    this.stakeholderForm = this.createStakeholderForm();
    this.rolForm = this.createRolForm();
  }

  private createStakeholderForm() {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      rolId: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(220)]],
    });
  }

  private createRolForm() {
    return this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
    });
  }

  rolesOrdenados = computed(() =>
    [...this.roles()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
  );

  stakeholdersFiltrados = computed(() => {
    const q = this.busqueda().trim().toLowerCase();
    const rolesMap = new Map(this.roles().map(r => [r.id.toString(), r.nombre.toLowerCase()]));
    const base = [...this.stakeholders()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

    if (!q) return base;

    return base.filter(s => {
      const rolNombre = rolesMap.get(s.rolId.toString()) ?? '';
      return s.nombre.toLowerCase().includes(q) || rolNombre.includes(q);
    });
  });

  rolesFiltrados = computed(() => {
    const q = this.busqueda().trim().toLowerCase();
    const base = this.rolesOrdenados();
    if (!q) return base;
    return base.filter(r => r.nombre.toLowerCase().includes(q));
  });

  cambiarTab(tab: TabStakeholders): void {
    this.tabActiva.set(tab);
    this.busqueda.set('');
  }

  setBusqueda(valor: string): void {
    this.busqueda.set(valor);
  }

  // ============ Stakeholders ============
  abrirModalNuevoStakeholder(): void {
    this.editandoStakeholderId.set(null);
    this.stakeholderForm.reset({ nombre: '', rolId: '', descripcion: '' });
    this.modalStakeholderAbierto.set(true);
  }

  abrirModalEditarStakeholder(s: Stakeholder): void {
    this.editandoStakeholderId.set(s.id);
    this.stakeholderForm.reset({ nombre: s.nombre, rolId: s.rolId, descripcion: s.descripcion });
    this.modalStakeholderAbierto.set(true);
  }

  cerrarModalStakeholder(): void {
    this.modalStakeholderAbierto.set(false);
    this.editandoStakeholderId.set(null);
  }

  guardarStakeholder(): void {
    if (this.stakeholderForm.invalid) {
      this.stakeholderForm.markAllAsTouched();
      return;
    }

    const nombre = (this.stakeholderForm.value.nombre ?? '').trim();
    const rolId = (this.stakeholderForm.value.rolId ?? '').trim();
    const descripcion = (this.stakeholderForm.value.descripcion ?? '').trim();

    const idEdit = this.editandoStakeholderId();
    const lista = [...this.stakeholders()];

    if (idEdit) {
      const idx = lista.findIndex(x => x.id === idEdit);
      if (idx !== -1) lista[idx] = { ...lista[idx], nombre, rolId, descripcion };
    } else {
      const nuevo: Stakeholder = {
        id: `sh-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        nombre,
        rolId,
        descripcion,
      };
      lista.unshift(nuevo);
    }

    this.stakeholders.set(lista);
    this.persistirStakeholders(lista);
    this.cerrarModalStakeholder();
  }

  eliminarStakeholder(id: string): void {
    const lista = this.stakeholders().filter(s => s.id !== id);
    this.stakeholders.set(lista);
    this.persistirStakeholders(lista);
  }

  // ============ Roles ============
  abrirModalNuevoRol(): void {
    this.editandoRolId.set(null);
    this.rolForm.reset({ nombre: '' });
    this.modalRolAbierto.set(true);
  }

  abrirModalEditarRol(r: Rol): void {
    this.editandoRolId.set(r.id);
    this.rolForm.reset({ nombre: r.nombre });
    this.modalRolAbierto.set(true);
  }

  cerrarModalRol(): void {
    this.modalRolAbierto.set(false);
    this.editandoRolId.set(null);
  }

  guardarRol(): void {
    if (this.rolForm.invalid) {
      this.rolForm.markAllAsTouched();
      return;
    }

    const nombre = (this.rolForm.value.nombre ?? '').trim();

    const idEdit = this.editandoRolId();
    const lista = [...this.roles()];

    if (idEdit) {
      const idx = lista.findIndex(x => x.id === idEdit);
      if (idx !== -1) lista[idx] = { ...lista[idx], nombre };
    } else {
      const nuevo: Rol = { id: Date.now(), nombre };
      lista.unshift(nuevo);
    }

    this.roles.set(lista);
    this.persistirRoles(lista);
    this.cerrarModalRol();
  }

  eliminarRol(id: number): void {
    // Rol eliminado => stakeholders quedan con rolId ''
    const roles = this.roles().filter(r => r.id !== id);
    const stakeholders = this.stakeholders().map(s => (s.rolId === id.toString() ? { ...s, rolId: '' } : s));

    this.roles.set(roles);
    this.stakeholders.set(stakeholders);

    this.persistirRoles(roles);
    this.persistirStakeholders(stakeholders);
  }

  obtenerNombreRol(rolId: string): string {
    return this.roles().find(r => r.id.toString() === rolId)?.nombre ?? 'Sin rol';
  }

  // ============ Storage ============
  private cargarRoles(): Rol[] {
    try {
      const raw = localStorage.getItem(this.KEY_ROLES);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Rol[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private cargarStakeholders(): Stakeholder[] {
    try {
      const raw = localStorage.getItem(this.KEY_STAKEHOLDERS);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Stakeholder[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private persistirRoles(lista: Rol[]): void {
    try {
      localStorage.setItem(this.KEY_ROLES, JSON.stringify(lista));
    } catch {}
  }

  private persistirStakeholders(lista: Stakeholder[]): void {
    try {
      localStorage.setItem(this.KEY_STAKEHOLDERS, JSON.stringify(lista));
    } catch {}
  }



  onKeydownModal(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.cerrarModalStakeholder();
      this.cerrarModalRol();
    }
  }
}
