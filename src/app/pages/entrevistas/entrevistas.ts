import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Entrevista, Proyecto } from '../../interfaces/entrevista.interface';

interface CreateProjectForm {
  nombre: string;
  descripcion: string;
}

interface CreateEntrevistaForm {
  nombre: string;
  descripcion: string;
}

type AlertType = 'success' | 'error';

@Component({
  selector: 'app-entrevistas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entrevistas.html',
  styleUrl: './entrevistas.scss'
})
export class Entrevistas implements OnInit {
  // ===== PROPERTIES =====

  // Vistas
  currentView: 'projects' | 'dashboard' = 'projects';

  // Proyectos
  proyectos: Proyecto[] = [];
  proyectoSeleccionado: Proyecto | null = null;

  // Entrevistas
  entrevistas: Entrevista[] = [];
  historial: Entrevista[] = [];
  activeTab: 'entrevistas' | 'historial' = 'entrevistas';

  // Modales
  showCreateProjectModal = false;
  showCreateEntrevistaModal = false;
  showExecuteModal = false;

  // Formularios
  projectForm: CreateProjectForm = {
    nombre: '',
    descripcion: ''
  };

  entrevistaForm: CreateEntrevistaForm = {
    nombre: '',
    descripcion: ''
  };

  // Ejecución
  entrevistaSeleccionada: Entrevista | null = null;
  selectedStakeholder: string = '';

  // Alertas
  showAlert = false;
  alertMessage = '';
  alertType: AlertType = 'success';

  // ===== CONSTRUCTOR =====
  constructor() { }

  // ===== LIFECYCLE =====
  ngOnInit(): void {
    this.loadProjects();
  }

  // ===== MÉTODOS PÚBLICOS - PROYECTOS =====

  openCreateProjectModal(): void {
    this.resetProjectForm();
    this.showCreateProjectModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeProjectModal(): void {
    this.showCreateProjectModal = false;
    document.body.style.overflow = 'auto';
  }

  saveProject(): void {
    if (!this.validateProjectForm()) {
      this.showNotification('Completa todos los campos', 'error');
      return;
    }

    const newProject: Proyecto = {
      id: Date.now(),
      nombre: this.projectForm.nombre,
      descripcion: this.projectForm.descripcion || undefined,
      fechaCreacion: new Date()
    };

    this.proyectos.unshift(newProject);
    this.showNotification('Proyecto creado correctamente', 'success');
    this.closeProjectModal();
  }

  selectProject(proyecto: Proyecto): void {
    this.proyectoSeleccionado = proyecto;
    this.currentView = 'dashboard';
    this.loadProjectEntrevistas();
  }

  backToProjects(): void {
    this.currentView = 'projects';
    this.proyectoSeleccionado = null;
    this.entrevistas = [];
    this.historial = [];
  }

  // ===== MÉTODOS PÚBLICOS - ENTREVISTAS =====

  changeTab(tab: 'entrevistas' | 'historial'): void {
    this.activeTab = tab;
  }

  openCreateEntrevistaModal(): void {
    this.resetEntrevistaForm();
    this.showCreateEntrevistaModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeEntrevistaModal(): void {
    this.showCreateEntrevistaModal = false;
    document.body.style.overflow = 'auto';
  }

  saveEntrevista(): void {
    if (!this.validateEntrevistaForm()) {
      this.showNotification('Completa todos los campos', 'error');
      return;
    }

    if (!this.proyectoSeleccionado) {
      this.showNotification('No hay proyecto seleccionado', 'error');
      return;
    }

    const newEntrevista: Entrevista = {
      id: Date.now(),
      nombre: this.entrevistaForm.nombre,
      descripcion: this.entrevistaForm.descripcion || undefined,
      proyectoId: this.proyectoSeleccionado.id,
      preguntas: [],
      estado: 'Pendiente',
      fechaCreacion: new Date()
    };

    this.entrevistas.unshift(newEntrevista);
    this.showNotification('Entrevista creada correctamente', 'success');
    this.closeEntrevistaModal();
  }

  openExecuteModal(entrevista: Entrevista): void {
    this.entrevistaSeleccionada = entrevista;
    this.selectedStakeholder = '';
    this.showExecuteModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeExecuteModal(): void {
    this.showExecuteModal = false;
    this.entrevistaSeleccionada = null;
    this.selectedStakeholder = '';
    document.body.style.overflow = 'auto';
  }

  executeInterview(): void {
    if (!this.selectedStakeholder || !this.entrevistaSeleccionada) {
      this.showNotification('Selecciona un stakeholder', 'error');
      return;
    }

    this.showNotification('Entrevista ejecutada correctamente', 'success');
    this.closeExecuteModal();
  }

  closeAlert(): void {
    this.showAlert = false;
  }

  // ===== MÉTODOS PRIVADOS =====

  private loadProjects(): void {
    // Arrays inicializados vacíos, listos para recibir datos del backend
    this.proyectos = [];
  }

  private loadProjectEntrevistas(): void {
    // Cargar entrevistas del proyecto seleccionado
    this.entrevistas = [];
    this.historial = [];
  }

  private validateProjectForm(): boolean {
    const { nombre } = this.projectForm;
    return !!(nombre && nombre.trim());
  }

  private validateEntrevistaForm(): boolean {
    const { nombre } = this.entrevistaForm;
    return !!(nombre && nombre.trim());
  }

  private resetProjectForm(): void {
    this.projectForm = {
      nombre: '',
      descripcion: ''
    };
  }

  private resetEntrevistaForm(): void {
    this.entrevistaForm = {
      nombre: '',
      descripcion: ''
    };
  }

  private showNotification(message: string, type: AlertType): void {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;

    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showCreateProjectModal) {
      this.closeProjectModal();
    }
    if (this.showCreateEntrevistaModal) {
      this.closeEntrevistaModal();
    }
    if (this.showExecuteModal) {
      this.closeExecuteModal();
    }
  }
}
