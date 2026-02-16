import { Component, HostListener, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {

  isCollapsed = false;
  isMobile = false;

  @Output() estadoSidebar = new EventEmitter<boolean>();

  menuItems = [
    { label: 'Inicio', icon: 'dashboard', route: '/inicio' },
    { label: 'Proyectos', icon: 'folder', route: '/proyectos' },
    { label: 'Stakeholders', icon: 'groups', route: '/stakeholders' },
    { label: 'Entrevistas', icon: 'chat', route: '/entrevistas' },
    { label: 'Cuestionarios', icon: 'quiz', route: '/cuestionarios' },
    { label: 'Observaciones', icon: 'visibility', route: '/observaciones' },
    { label: 'Focus Group', icon: 'record_voice_over', route: '/focus-group' },
    { label: 'Archivos', icon: 'folder_open', route: '/archivos' },
    { label: 'Historias', icon: 'menu_book', route: '/historias' }
  ];

  constructor() {
    this.checkScreenSize();
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile = window.innerWidth < 900;

    if (this.isMobile) {
      this.isCollapsed = true;
    }
  }
}
