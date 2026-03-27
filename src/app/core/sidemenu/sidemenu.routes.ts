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
        loadComponent: () =>
          import('./../../features/dashboard/containers/dashboard/dashboard').then(
            (c) => c.Dashboard,
          ),
      },
    ],
  },
];
