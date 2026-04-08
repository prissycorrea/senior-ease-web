import { effect, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, user } from '@angular/fire/auth';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { map, Observable, of, switchMap } from 'rxjs';
import { ThemeConfig, UserConfig } from './entities/config.entity';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly _firestore = inject(Firestore);
  private readonly _auth = inject(Auth);
  private readonly _collection = 'user_configs';

  private user$ = user(this._auth);

  private readonly DEFAULT_CONFIG: UserConfig = {
    fontSize: '16',
    theme: 'light-theme',
  };

  public userConfig = toSignal<UserConfig>(
    this.user$.pipe(
      switchMap((currentUser) => {
        if (!currentUser) {
          return of(this.DEFAULT_CONFIG);
        }
        const configDocRef = doc(this._firestore, `${this._collection}/${currentUser.uid}`);

        return docData(configDocRef) as Observable<UserConfig>;
      }),
      map((config) => config || this.DEFAULT_CONFIG),
    ),
  );

  public isSaving = signal(false);

  constructor() {
    effect(() => {
      const config = this.userConfig();
      if (config) {
        this.applyTheme(config.theme);
        this.applyFontSize(config.fontSize);
      }
    });
  }

  async updateConfig(newConfig: Partial<UserConfig>) {
    const currentUser = this._auth.currentUser;
    if (!currentUser) return;

    this.isSaving.set(true);
    try {
      const configDocRef = doc(this._firestore, `${this._collection}/${currentUser.uid}`);
      await setDoc(
        configDocRef,
        {
          ...this.userConfig(),
          ...newConfig,
          updatedAt: new Date(),
        },
        { merge: true },
      );
    } finally {
      this.isSaving.set(false);
    }
  }

  private applyTheme(theme: ThemeConfig) {
    const root = document.documentElement;
    if (theme === 'dark-theme') {
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
    } else {
      root.classList.add('light-mode');
      root.classList.remove('dark-mode');
    }
  }

  private applyFontSize(size: string) {
    const root = document.documentElement;
    root.style.setProperty('--font-size-base', `${size}px`);
  }
}
