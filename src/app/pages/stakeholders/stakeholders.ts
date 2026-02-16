import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Stakeholder } from '../../interfaces/stackeholders.interface';
import { Rol } from '../../interfaces/rol.interface';

@Component({
  selector: 'app-stakeholders',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './stakeholders.html',
  styleUrls: ['./stakeholders.scss']
})
export class StakeholdersComponent {

  // ===== CONTROL DE VISTA =====
  vistaRoles: boolean = false;

  // ===== CONTROL MODAL =====
  modalActivo: string = '';

  // ===== CONTADORES =====
  private contadorStakeholder = 1;
  private contadorRol = 1;

  // ===== LISTAS =====
  stakeholders: Stakeholder[] = [];
  roles: Rol[] = [];

  // ===== CAMPOS =====
  nuevoNombre = '';
  nuevoRol = '';
  nuevaDescripcion = '';
  nuevoNombreRol = '';

  // ===== CONTROL EDICIÓN =====
  editando = false;
  idEditando: number | null = null;

  // ===== CONTROL ELIMINACIÓN =====
  tipoEliminacion: 'stakeholder' | 'rol' | null = null;
  idEliminar: number | null = null;

  // ==============================
  // CAMBIO DE VISTA
  // ==============================
  mostrarStakeholders() {
    this.vistaRoles = false;
  }

  mostrarRoles() {
    this.vistaRoles = true;
  }

  // ==============================
  // ABRIR MODALES
  // ==============================
  abrirModalStakeholder() {
    this.editando = false;
    this.modalActivo = 'stakeholder';
  }

  abrirModalRol() {
    this.editando = false;
    this.modalActivo = 'rol';
  }

  cerrarModal() {
    this.modalActivo = '';
    this.editando = false;
    this.idEditando = null;
    this.limpiarCampos();
  }

  // ==============================
  // GUARDAR STAKEHOLDER
  // ==============================
  guardarStakeholder() {

    if (!this.nuevoNombre || !this.nuevoRol || !this.nuevaDescripcion) return;

    if (this.editando && this.idEditando !== null) {
      const index = this.stakeholders.findIndex(s => s.id === this.idEditando);
      if (index !== -1) {
        this.stakeholders[index] = {
          id: this.idEditando,
          nombre: this.nuevoNombre,
          rol: this.nuevoRol,
          descripcion: this.nuevaDescripcion
        };
      }
    } else {
      this.stakeholders.push({
        id: this.contadorStakeholder++,
        nombre: this.nuevoNombre,
        rol: this.nuevoRol,
        descripcion: this.nuevaDescripcion
      });
    }

    this.cerrarModal();
  }

  // ==============================
  // GUARDAR ROL
  // ==============================
 guardarRol() {

  if (!this.nuevoNombreRol || !this.nuevaDescripcion) return;

  if (this.editando && this.idEditando !== null) {

    const index = this.roles.findIndex(r => r.id === this.idEditando);

    if (index !== -1) {
      this.roles[index] = {
        id: this.idEditando,
        nombre: this.nuevoNombreRol,
        descripcion: this.nuevaDescripcion
      };
    }

  } else {

    this.roles.push({
      id: this.contadorRol++,
      nombre: this.nuevoNombreRol,
      descripcion: this.nuevaDescripcion   // 👈 ahora sí se guarda
    });

  }

  this.cerrarModal();
}


  // ==============================
  // EDITAR
  // ==============================
  editarStakeholder(s: Stakeholder) {
    this.editando = true;
    this.idEditando = s.id;
    this.nuevoNombre = s.nombre;
    this.nuevoRol = s.rol;
    this.nuevaDescripcion = s.descripcion;
    this.modalActivo = 'stakeholder';
  }

  editarRol(r: Rol) {
    this.editando = true;
    this.idEditando = r.id;
    this.nuevoNombreRol = r.nombre;
    this.modalActivo = 'rol';
  }

  // ==============================
  // ELIMINAR (ABRIR CONFIRMACIÓN)
  // ==============================
  confirmarEliminarStakeholder(id: number) {
    this.tipoEliminacion = 'stakeholder';
    this.idEliminar = id;
    this.modalActivo = 'confirmar';
  }

  confirmarEliminarRol(id: number) {
    this.tipoEliminacion = 'rol';
    this.idEliminar = id;
    this.modalActivo = 'confirmar';
  }

  eliminar() {

    if (this.tipoEliminacion === 'stakeholder') {
      this.stakeholders = this.stakeholders.filter(
        s => s.id !== this.idEliminar
      );
    }

    if (this.tipoEliminacion === 'rol') {
      this.roles = this.roles.filter(
        r => r.id !== this.idEliminar
      );
    }

    this.modalActivo = '';
    this.tipoEliminacion = null;
    this.idEliminar = null;
  }

  // ==============================
  private limpiarCampos() {
    this.nuevoNombre = '';
    this.nuevoRol = '';
    this.nuevaDescripcion = '';
    this.nuevoNombreRol = '';
  }
}
