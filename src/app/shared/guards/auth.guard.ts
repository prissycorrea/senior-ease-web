import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  // Usamos o authState (Observable) para garantir que o Firebase
  // já verificou se existe uma sessão ativa ao carregar a página
  return authState(auth).pipe(
    take(1), // Pega apenas o primeiro valor e encerra
    map((user) => {
      if (user) {
        return true; // Usuário logado, pode passar
      } else {
        // Usuário deslogado, manda para o login
        router.navigate(['/autenticacao/login']);
        return false;
      }
    })
  );
};