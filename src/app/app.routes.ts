import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent, // 🔥 Aquí se carga el layout
    children: [

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      {
        path: 'inicio',
        loadComponent: () =>
          import('./pages/inicio/inicio')
            .then(m => m.Inicio)
      },

      {
        path: 'proyectos',
        loadComponent: () =>
          import('./pages/proyectos/proyectos')
            .then(m => m.ProyectosComponent)
      },

      {
        path: 'stakeholders',
        loadComponent: () =>
          import('./pages/stakeholders/stakeholders')
            .then(m => m.StakeholdersComponent)
      },

      {
        path: 'entrevistas',
        loadComponent: () =>
          import('./pages/entrevistas/entrevistas')
            .then(m => m.Entrevistas)
      },

      {
        path: 'cuestionarios',
        loadComponent: () =>
          import('./pages/cuestionarios/cuestionarios')
            .then(m => m.Cuestionarios)
      },

      {
        path: 'observaciones',
        loadComponent: () =>
          import('./pages/observaciones/observaciones')
            .then(m => m.Observaciones)
      },

      {
        path: 'focus-group',
        loadComponent: () =>
          import('./pages/focus-group/focus-group')
            .then(m => m.FocusGroup)
      },

      {
        path: 'archivos',
        loadComponent: () =>
          import('./pages/archivos/archivos')
            .then(m => m.Archivos)
      },

      {
        path: 'historias',
        loadComponent: () =>
          import('./pages/historias-de-usuario/historias-de-usuario')
            .then(m => m.HistoriasDeUsuario)
      }

    ]
  }
];
