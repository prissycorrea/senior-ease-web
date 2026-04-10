import { Routes } from '@angular/router';
import { AjustesIndex } from './containers/ajustes-index/ajustes-index';

export const AJUSTES_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AjustesIndex,
        children: [
          {
            path: '',
            loadComponent: () => import('./containers/ajustes/ajustes').then((c) => c.Ajustes),
          },

          {
            path: 'letras',
            loadComponent: () =>
              import('../../features/settings-wizard/components/font-size/font-size').then(
                (c) => c.FontSize,
              ),
          },
          {
            path: 'cores',
            loadComponent: () =>
              import('../../features/settings-wizard/components/theme-selection/theme-selection').then(
                (c) => c.ThemeSelection,
              ),
          },
          {
            path: 'perfil',
            loadComponent: () =>
              import('./containers/ajustes-profile/ajustes-profile').then((c) => c.AjustesProfile),
          },
        ],
      },
    ],
  },
];
