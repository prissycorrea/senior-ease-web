import { Routes } from '@angular/router';

// Exemplo da estrutura lógica no app.routes.ts
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'setup', // Ou uma lógica de redirecionamento dinâmico
  },
  {
    path: 'setup',
    loadComponent: () =>
      import('./features/settings-wizard/containers/settings-wizard-stepper/settings-wizard-stepper').then(
        (m) => m.SettingsWizardStepper,
      ),
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
