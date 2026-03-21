import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'app-theme-selection',
  imports: [],
  templateUrl: './theme-selection.html',
  styleUrl: './theme-selection.scss',
})
export class ThemeSelection {
  themes = [
    { id: 'light-theme', label: 'Padrão', desc: 'Texto de exemplo fácil de ler.' },
    { id: 'dark-theme', label: 'Alto contraste', desc: 'Texto de exemplo fácil de ler.' },
  ];

  // Signal para controlar a seleção
  selectedTheme = signal<string>('light-theme');
  optionEmit = output<string>();

  onSelect(id: string) {
    this.selectedTheme.set(id);
    console.log('Tema selecionado:', id);
  }
}
