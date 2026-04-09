import { inject, Injectable, Injector, runInInjectionContext, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, updatePassword, updateProfile, user } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { map, Observable, of, switchMap } from 'rxjs';
import { UserProfile } from './entities/profile.entity';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly _firestore = inject(Firestore);
  private readonly _auth = inject(Auth);
  private readonly _injector = inject(Injector);
  private readonly _collection = 'profiles';

  private user$ = user(this._auth);

  public profile = toSignal<UserProfile | null>(
    this.user$.pipe(
      switchMap((currentUser) => {
        if (!currentUser) return of(null);

        return runInInjectionContext(this._injector, () => {
          const profileDocRef = doc(this._firestore, `${this._collection}/${currentUser.uid}`);

          return (docData(profileDocRef) as Observable<UserProfile>).pipe(
            map((data) => {
              return {
                userId: currentUser.uid,
                name: data?.name || currentUser.displayName || 'Usuário',
                email: data?.email || currentUser.email || '',
                photoURL: data?.photoURL || currentUser.photoURL || '',
              };
            }),
          );
        });
      }),
      map((data) => data || null),
    ),
  );
  public loadingProfile = signal<boolean>(false);

  /**
   * Atualiza os dados do perfil
   */
  async updateProfileData(data: Partial<UserProfile>) {
    this.loadingProfile.set(true);
    const currentUser = this._auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');

    const profileDocRef = doc(this._firestore, `${this._collection}/${currentUser.uid}`);

    try {
      await setDoc(
        profileDocRef,
        {
          ...data,
          userId: currentUser.uid,
          updatedAt: new Date(),
        },
        { merge: true },
      );

      if (data.name || data.photoURL) {
        await updateProfile(currentUser, {
          displayName: data.name || currentUser.displayName,
          photoURL: data.photoURL || currentUser.photoURL,
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    } finally {
      this.loadingProfile.set(false);
    }
  }

  /**
   * Altera a senha do usuário
   */
  async changePassword(newPassword: string) {
    const currentUser = this._auth.currentUser;
    if (!currentUser) throw new Error('Usuário não autenticado');

    try {
      await updatePassword(currentUser, newPassword);
    } catch (error: any) {
      throw error;
    }
  }
}
