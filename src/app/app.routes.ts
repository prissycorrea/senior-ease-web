import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

// Exemplo da estrutura lógica no app.routes.ts
export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () => import('./core/sidemenu/sidemenu.routes').then((r) => r.SIDEMENU_ROUTES),
  },
  {
    path: 'configuracao',
    loadComponent: () =>
      import('./features/settings-wizard/containers/settings-wizard-stepper/settings-wizard-stepper').then(
        (c) => c.SettingsWizardStepper,
      ),
  },
  {
    path: 'autenticacao',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'feedback',
    loadComponent: () => import('./shared/components/feedback/feedback').then((c) => c.Feedback),
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
