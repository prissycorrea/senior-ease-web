import { inject, Injectable, Injector, runInInjectionContext, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, updatePassword, updateProfile, user } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { map, Observable, of, switchMap } from 'rxjs';
import { MessageService } from '../../../shared/components/toaster/toaster.service';
import { UserProfile } from './entities/profile.entity';

/**
 * Serviço responsável pelo gerenciamento do perfil do usuário.
 * Sincroniza dados do Firebase Authentication com documentos estendidos no Firestore.
 */
@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly _firestore = inject(Firestore);
  private readonly _auth = inject(Auth);
  private readonly _injector = inject(Injector);
  private readonly _message = inject(MessageService);
  private readonly _collection = 'profiles';

  /** Observable do usuário atualmente logado no Firebase Auth. */
  private user$ = user(this._auth);

  // ==========================================================================
  // SIGNALS DE DADOS
  // ==========================================================================

  /**
   * Signal que contém os dados combinados do perfil do usuário (Auth + Firestore).
   * Atualiza automaticamente em tempo real se o documento no banco for alterado.
   * Retorna null caso o usuário não esteja logado ou os dados ainda estejam carregando.
   */
  public profile = toSignal<UserProfile | null>(
    this.user$.pipe(
      switchMap((currentUser) => {
        if (!currentUser) return of(null);

        return runInInjectionContext(this._injector, () => {
          const profileDocRef = doc(this._firestore, `${this._collection}/${currentUser.uid}`);

          return (docData(profileDocRef) as Observable<UserProfile>).pipe(
            map((data) => ({
              userId: currentUser.uid,
              name: data?.name || currentUser.displayName || 'Usuário',
              email: data?.email || currentUser.email || '',
              photoURL: data?.photoURL || currentUser.photoURL || '',
            })),
          );
        });
      }),
    ),
    { initialValue: null },
  );

  // ==========================================================================
  // ESTADOS DE CARREGAMENTO (Loading Indicators)
  // ==========================================================================

  /** Indica se existe uma requisição em andamento para salvar os dados do perfil. */
  public isUpdatingProfile = signal<boolean>(false);

  /** Indica se existe uma requisição em andamento para alterar a senha. */
  public isChangingPassword = signal<boolean>(false);

  // ==========================================================================
  // MÉTODOS DE AÇÃO
  // ==========================================================================

  /**
   * Atualiza as informações do perfil do usuário.
   * Salva os dados estendidos no Firestore e atualiza o display name/foto no Auth.
   * @param data Objeto parcial contendo os dados a serem atualizados.
   */
  async updateProfileData(data: Partial<UserProfile>): Promise<void> {
    const currentUser = this._auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');

    this.isUpdatingProfile.set(true);

    try {
      const profileDocRef = doc(this._firestore, `${this._collection}/${currentUser.uid}`);

      // 1. Atualiza os dados customizados no Firestore (merge: true preserva campos não enviados)
      await setDoc(
        profileDocRef,
        {
          ...data,
          userId: currentUser.uid,
          updatedAt: new Date(),
        },
        { merge: true },
      );

      // 2. Atualiza os dados básicos espelhados no Firebase Auth
      if (data.name || data.photoURL) {
        await updateProfile(currentUser, {
          displayName: data.name || currentUser.displayName,
          photoURL: data.photoURL || currentUser.photoURL,
        });
      }

      this._message.success('Perfil atualizado com sucesso!');
    } catch (error) {
      this._message.error(error);
      throw error;
    } finally {
      this.isUpdatingProfile.set(false);
    }
  }

  /**
   * Altera a senha do usuário logado.
   * Atenção: Pode disparar um erro `auth/requires-recent-login` se a sessão for antiga.
   * @param newPassword A nova senha desejada.
   */
  async changePassword(newPassword: string): Promise<void> {
    const currentUser = this._auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');

    this.isChangingPassword.set(true);

    try {
      await updatePassword(currentUser, newPassword);
      this._message.success('Senha alterada com sucesso!');
    } catch (error) {
      this._message.error(error);
      throw error;
    } finally {
      this.isChangingPassword.set(false);
    }
  }
}
