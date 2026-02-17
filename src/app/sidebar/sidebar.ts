import { Component, HostListener, Output, EventEmitter, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

interface Proyecto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  estado: 'activo' | 'completado' | 'pausado';
}

interface Usuario {
  avatar: string;
  nombre: string;
  rol: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent implements OnInit {

  isCollapsed = false;
  isMobile = false;
  mostrarMenuProyecto = false;
  mostrarMenuUsuario = false;
  showAllProjects = false;

  @Output() estadoSidebar = new EventEmitter<boolean>();
  @Output() proyectoSeleccionado = new EventEmitter<Proyecto>();

  // Propiedades de proyecto y usuario
  proyectoActual!: Proyecto;
  usuarioActual: Usuario = {
    avatar: 'CR',
    nombre: 'Cristian Rodríguez',
    rol: 'Project Manager'
  };

  proyectosDisponibles: Proyecto[] = [
    {
      id: 1,
      codigo: 'PROJ-001',
      nombre: 'Sistema de Requerimientos',
      descripcion: 'Platform para gestión de requerimientos',
      estado: 'activo'
    },
    {
      id: 2,
      codigo: 'PROJ-002',
      nombre: 'Portal de Clientes',
      descripcion: 'Portal web para clientes',
      estado: 'activo'
    },
    {
      id: 3,
      codigo: 'PROJ-003',
      nombre: 'API Backend',
      descripcion: 'API Rest del sistema',
      estado: 'completado'
    },
    {
      id: 4,
      codigo: 'PROJ-004',
      nombre: 'Módulo de Reportes',
      descripcion: 'Reportes y análisis',
      estado: 'pausado'
    }
  ];

  // Menús organizados por sección
  menuPrincipal = [
    { label: 'Dashboard', icon: 'dashboard', route: 'principal' },
    { label: 'Procesos', icon: 'settings', route: 'procesos' }
  ];

  menuRoles = [
    { label: 'Stakeholders', icon: 'groups', route: 'stakeholders' },
    // { label: 'Roles', icon: 'person', route: 'roles' }
  ];

  menuTecnicas = [
    { label: 'Entrevistas', icon: 'chat', route: 'entrevistas' },
    { label: 'Cuestionarios', icon: 'quiz', route: 'cuestionarios' },
    { label: 'Archivos', icon: 'folder_open', route: 'archivos' },
    { label: 'Historias de Usuario', icon: 'menu_book', route: 'historias-de-usuario' },
    { label: 'Observaciones', icon: 'visibility', route: 'observaciones' },
    { label: 'Focus Group', icon: 'record_voice_over', route: 'focus-group' }
  ];

  constructor(private router: Router) {
    this.checkScreenSize();
  }

  ngOnInit() {
    // Inicializar con el primer proyecto
    this.proyectoActual = this.proyectosDisponibles[0];
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.estadoSidebar.emit(this.isCollapsed);
  }

  toggleMenuProyecto() {
    this.mostrarMenuProyecto = !this.mostrarMenuProyecto;
    this.mostrarMenuUsuario = false;
    this.showAllProjects = false;
  }

  toggleMenuUsuario() {
    this.mostrarMenuUsuario = !this.mostrarMenuUsuario;
    this.mostrarMenuProyecto = false;
  }

  toggleAllProjects() {
    this.showAllProjects = !this.showAllProjects;
  }

  cambiarAProyecto(proyecto: Proyecto) {
    this.proyectoActual = proyecto;
    this.proyectoSeleccionado.emit(proyecto);
    this.mostrarMenuProyecto = false;
    this.showAllProjects = false;
  }

  irAlSelectorProyectos() {
    this.router.navigate(['/principal']);
    this.mostrarMenuProyecto = false;
  }

  cerrarSesion() {
    // Lógica para cerrar sesión y regresar a inicio
    this.router.navigate(['/inicio']);
    this.mostrarMenuUsuario = false;
  }

  getIconoEstado(estado: string): string {
    switch (estado) {
      case 'activo': return 'check_circle';
      case 'completado': return 'task_alt';
      case 'pausado': return 'pause_circle';
      default: return 'circle';
    }
  }

  getColorEstado(estado: string): string {
    switch (estado) {
      case 'activo': return '#10b981';
      case 'completado': return '#0ea5e9';
      case 'pausado': return '#f59e0b';
      default: return '#6b7280';
    }
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile = window.innerWidth < 1200;
    // El sidebar siempre debe ser visible, no se oculta en mobile
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.menu-proyecto') && !target.closest('.menu-usuario')) {
      this.mostrarMenuProyecto = false;
      this.mostrarMenuUsuario = false;
      this.showAllProjects = false;
    }
  }
}
