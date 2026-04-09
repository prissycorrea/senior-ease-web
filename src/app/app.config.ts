import {
  APP_INITIALIZER,
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore } from '@angular/fire/firestore';
import { provideRouter } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environments } from '../environments/environments';
import { routes } from './app.routes';
import { ConfigService } from './features/settings-wizard/services/config.service';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'pt-BR' },

    // Configurando os "pedaços" do Firebase para o SeniorEase
    provideFirebaseApp(() => initializeApp(environments.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: ConfigService) => () => {
        // Não precisamos retornar uma Promise aqui porque o seu
        // serviço usa Signals/Effects internamente.
        // Só de injetá-lo, o constructor executa.
        return Promise.resolve();
      },
      deps: [ConfigService],
      multi: true,
    },
  ],
};
