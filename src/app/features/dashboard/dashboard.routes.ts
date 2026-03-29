import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./containers/dashboard/dashboard').then((c) => c.Dashboard),
      },
      {
        path: 'nova-tarefa',
        loadComponent: () =>
          import('./containers/dashboard-novo/dashboard-novo').then((c) => c.DashboardNovo),
      },
      {
        path: 'feedback',
        loadComponent: () =>
          import('../../shared/components/feedback/feedback').then((c) => c.Feedback),
      },
    ],
  },
];
