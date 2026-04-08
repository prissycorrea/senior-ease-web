import { Component, effect, inject, signal, untracked } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { ThemeConfig } from '../../services/entities/config.entity';

@Component({
  selector: 'app-theme-selection',
  imports: [],
  templateUrl: './theme-selection.html',
  styleUrl: './theme-selection.scss',
})
export class ThemeSelection {
  private _configService = inject(ConfigService);
  themes: any = [
    { id: 'light-theme', label: 'Padrão', desc: 'Texto de exemplo fácil de ler.' },
    { id: 'dark-theme', label: 'Alto contraste', desc: 'Texto de exemplo fácil de ler.' },
  ];

  // Signal para controlar a seleção
  selectedTheme = signal<ThemeConfig>('light-theme');

  constructor() {
    effect(() => {
      // Pegamos o valor do serviço (fonte da verdade)
      const themeFromFirebase = this._configService.userConfig()?.theme;

      // Atualizamos o sinal local APENAS se ele for diferente do que está no serviço
      // Isso evita qualquer processamento desnecessário
      if (themeFromFirebase && themeFromFirebase !== this.selectedTheme()) {
        // O untracked (opcional) garante que o effect não observe mudanças no selectedTheme
        untracked(() => this.selectedTheme.set(themeFromFirebase));
      }
    });
  }

  onSelect(theme: ThemeConfig) {
    this.selectedTheme.set(theme);
    this._configService.updateConfig({ theme });
  }
}
