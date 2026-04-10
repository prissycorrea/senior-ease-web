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
      const themeFromFirebase = this._configService.userConfig()?.theme;
      if (themeFromFirebase && themeFromFirebase !== this.selectedTheme()) {
        untracked(() => this.selectedTheme.set(themeFromFirebase));
      }
    });
  }

  onSelect(theme: ThemeConfig) {
    this.selectedTheme.set(theme);
    this._configService.updateConfig({ theme });
  }
}
