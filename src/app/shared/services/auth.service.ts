import { computed, inject, Injectable, signal } from '@angular/core';
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
import { MessageService } from '../components/toaster/toaster.service';

/**
 * Serviço responsável pelo gerenciamento de autenticação de usuários.
 * Lida com login, cadastro, logout e rastreamento do estado do usuário em tempo real.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly _message = inject(MessageService);

  // ==========================================================================
  // SIGNALS DE ESTADO DE AUTENTICAÇÃO
  // ==========================================================================

  /**
   * Signal que reflete o estado do usuário logado em tempo real.
   * Retorna o objeto User do Firebase se logado, ou null se deslogado.
   */
  public user = toSignal(authState(this.auth), { initialValue: null });

  /**
   * Signal computado que retorna um booleano indicando se há um usuário ativo.
   * Reage automaticamente às mudanças do Signal `user`.
   */
  public isLoggedIn = computed(() => !!this.user());

  // ==========================================================================
  // ESTADOS DE CARREGAMENTO (Loading Indicators)
  // ==========================================================================

  /** Indica se existe uma requisição de login em andamento. */
  public isLoggingIn = signal(false);

  /** Indica se existe uma requisição de cadastro em andamento. */
  public isRegistering = signal(false);

  /** Indica se existe uma requisição de logout em andamento. */
  public isLoggingOut = signal(false);

  // ==========================================================================
  // MÉTODOS DE AÇÃO
  // ==========================================================================

  /**
   * Realiza o login do usuário usando E-mail e Senha.
   * Navega automaticamente para o dashboard em caso de sucesso.
   * @param email E-mail do usuário.
   * @param pass Senha do usuário.
   */
  async login(email: string, pass: string): Promise<void> {
    this.isLoggingIn.set(true);
    try {
      await signInWithEmailAndPassword(this.auth, email, pass);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      this._message.error(error);
      throw error;
    } finally {
      this.isLoggingIn.set(false);
    }
  }

  /**
   * Realiza o cadastro de um novo usuário usando E-mail e Senha.
   * Atualiza o perfil com o nome fornecido e navega para o dashboard.
   * @param username Nome de exibição do usuário (DisplayName).
   * @param email E-mail para cadastro.
   * @param pass Senha para cadastro.
   */
  async cadastrar(username: string, email: string, pass: string): Promise<void> {
    this.isRegistering.set(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, pass);
      const user = userCredential.user;

      if (user) {
        await updateProfile(user, { displayName: username });
        await user.reload();
        this.router.navigate(['/dashboard']);
      }
    } catch (error) {
      this._message.error(error);
      throw error;
    } finally {
      this.isRegistering.set(false);
    }
  }

  /**
   * Encerra a sessão do usuário atual no Firebase.
   * Navega automaticamente para a tela de login.
   */
  async logout(): Promise<void> {
    this.isLoggingOut.set(true);
    try {
      await signOut(this.auth);
      this.router.navigate(['/autenticacao']);
    } catch (error) {
      this._message.error(error);
      throw error;
    } finally {
      this.isLoggingOut.set(false);
    }
  }
}
