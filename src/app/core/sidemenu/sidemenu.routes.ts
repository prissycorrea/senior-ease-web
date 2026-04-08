import { Routes } from '@angular/router';

export const SIDEMENU_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./sidemenu').then((c) => c.Sidemenu),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../../features/dashboard/dashboard.routes').then((r) => r.DASHBOARD_ROUTES),
      },
      {
        path: 'ajustes',
        loadChildren: () =>
          import('../../features/ajustes/ajustes.routes').then((r) => r.AJUSTES_ROUTES),
      },
    ],
  },
];
