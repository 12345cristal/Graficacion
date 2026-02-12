import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class LayoutComponent {}
