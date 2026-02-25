// ========================================
// ARCHIVO DE EJEMPLO - RUTAS A INTEGRAR
// ========================================
// Este archivo muestra cómo integrar los nuevos componentes
// en tu archivo app.routes.ts. NO ejecutar este archivo directamente.

/*

import { Routes } from '@angular/router';

// Importar los nuevos componentes
import { AnalisisDocumentalComponent } from './pages/analisis_documental/analisis-documental';
import { LoginComponent } from './pages/login/login';

// Importar otros componentes existentes
import { Archivos } from './pages/archivos/archivos';
import { Cuestionarios } from './pages/cuestionarios/cuestionarios';
import { Entrevistas } from './pages/entrevistas/entrevistas';
import { HistoriasDeUsuario } from './pages/historias-de-usuario/historias-de-usuario';
import { FocusGroup } from './pages/focus-group/focus-group';
import { Observaciones } from './pages/observaciones/observaciones';
import { Stakeholders } from './pages/stakeholders/stakeholders';
import { Inicio } from './pages/inicio/inicio';
import { Principal } from './pages/principal/principal';
import { LayoutComponent } from './layout/layout';

// Servicios
import { CuentaService } from './services/cuenta.service';
import { AnalisisDocumentalService } from './services/analisis-documental.service';

export const routes: Routes = [
  // Rutas de autenticación
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Iniciar Sesión' }
  },

  // Rutas protegidas (con layout)
  {
    path: 'app',
    component: LayoutComponent,
    // canActivate: [autenticacionGuard], // Descomentar si usas guards
    children: [
      {
        path: 'inicio',
        component: Inicio,
        data: { title: 'Inicio' }
      },
      {
        path: 'principal',
        component: Principal,
        data: { title: 'Principal' }
      },
      {
        path: 'archivos',
        component: Archivos,
        data: { title: 'Archivos' }
      },
      {
        path: 'cuestionarios',
        component: Cuestionarios,
        data: { title: 'Cuestionarios' }
      },
      {
        path: 'entrevistas',
        component: Entrevistas,
        data: { title: 'Entrevistas' }
      },
      {
        path: 'historias-usuario',
        component: HistoriasDeUsuario,
        data: { title: 'Historias de Usuario' }
      },
      {
        path: 'focus-group',
        component: FocusGroup,
        data: { title: 'Focus Group' }
      },
      {
        path: 'observaciones',
        component: Observaciones,
        data: { title: 'Observaciones' }
      },
      {
        path: 'stakeholders',
        component: Stakeholders,
        data: { title: 'Stakeholders' }
      },
      
      // 🆕 NUEVAS RUTAS AGREGADAS
      {
        path: 'analisis-documental',
        component: AnalisisDocumentalComponent,
        data: { title: 'Análisis Documental' }
      },
      
      // Ruta por defecto
      {
        path: '',
        redirectTo: 'principal',
        pathMatch: 'full'
      }
    ]
  },

  // Ruta raíz
  {
    path: '',
    redirectTo: '/app/principal',
    pathMatch: 'full'
  },

  // Ruta no encontrada
  {
    path: '**',
    redirectTo: '/app/principal'
  }
];

*/

// ========================================
// ALTERNATIVA: Usar Guards para proteger
// ========================================

/*

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CuentaService } from './services/cuenta.service';

export const autenticacionGuard = () => {
  const cuentaService = inject(CuentaService);
  const router = inject(Router);

  if (cuentaService.estaAutenticado()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

// Usar en las rutas:
{
  path: 'app',
  component: LayoutComponent,
  canActivate: [autenticacionGuard],
  children: [...]
}

*/
