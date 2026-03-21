import { Routes } from '@angular/router';

// Exemplo da estrutura lógica no app.routes.ts
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'configuracao', // Ou uma lógica de redirecionamento dinâmico
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
    loadComponent: () => import('./features/auth/containers/auth').then((c) => c.Auth),
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
