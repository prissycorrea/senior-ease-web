import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  host: {
    '[class.w-100]': 'full()',
  },
})
export class Button {
  public label = input<string>('');
  public labelLoading = input<string>('Carregando...');
  public type = input<'primary' | 'secondary'>('primary');
  public disabled = input<boolean>(false);
  public loading = input<boolean>(false);
  public direction = input<'row' | 'column'>('row');
  public full = input<boolean>(false);
}
