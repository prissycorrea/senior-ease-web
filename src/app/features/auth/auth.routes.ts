import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./containers/auth-root/auth-root').then((c) => c.AuthRoot),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('../../features/auth/containers/auth-login/auth-login').then((c) => c.AuthLogin),
      },
      {
        path: 'cadastro',
        loadComponent: () =>
          import('../../features/auth/containers/auth-cadastro/auth-cadastro').then(
            (c) => c.AuthCadastro,
          ),
      },
    ],
  },
];
