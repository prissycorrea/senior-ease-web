import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);

  // 1. Criamos um Signal que reflete o estado do usuário em tempo real
  // O 'authState' do Firebase avisa o Angular sempre que o login muda.
  user = toSignal(authState(this.auth));

  // 2. Signal computado para verificar se está logado (booleano)
  isLoggedIn = signal(false);

  constructor() {
    // Efeito colateral simples para atualizar o status
    authState(this.auth).subscribe((user) => {
      this.isLoggedIn.set(!!user);
    });
  }

  // --- MÉTODOS DE AÇÃO ---

  // Login com E-mail e Senha (Padrão)
  async login(email: string, pass: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, pass);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  // Login com Google (Excelente para idosos pela facilidade)
  // async loginComGoogle() {
  //   try {
  //     const provider = new GoogleAuthProvider();
  //     await signInWithPopup(this.auth, provider);
  //     this.router.navigate(['/tarefas']);
  //   } catch (error) {
  //     console.error('Erro Google Login:', error);
  //   }
  // }

  // Cadastro de novo usuário
  async cadastrar(username: string, email: string, pass: string) {
    try {
      // 1. Cria a conta no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, pass);

      const user = userCredential.user;

      if (user) {
        // 2. Vincula o "username" ao perfil do usuário
        await updateProfile(user, {
          displayName: username,
        });

        // 3. Atualiza o estado local para o Angular "perceber" o nome novo imediatamente
        await user.reload();

        console.log('Usuário cadastrado com sucesso:', user.displayName);

        // 4. Navega para a dashboard do SeniorEase
        this.router.navigate(['dashboard']);
      }
    } catch (error: any) {
      // Tratamento de erros comum no Firebase
      if (error.code === 'auth/email-already-in-use') {
        alert('Este e-mail já está cadastrado.');
      } else {
        console.error('Erro ao cadastrar:', error.message);
      }
      throw error;
    }
  }

  // Logout
  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}
