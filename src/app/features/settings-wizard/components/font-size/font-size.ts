import { Component, inject, signal } from '@angular/core';
import { Button } from '../../../../shared/components/button/button';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-font-size',
  imports: [Button],
  templateUrl: './font-size.html',
  styleUrl: './font-size.scss',
})
export class FontSize {
  private _configService = inject(ConfigService);
  public fontSize = signal<number>(16);

  public increaseFontSize() {
    this.fontSize.update((fontSize) => fontSize + 4);
    this._configService.updateConfig({ fontSize: this.fontSize().toString() });
  }

  public decreaseFontSize() {
    this.fontSize.update((fontSize) => fontSize - 4);
    this._configService.updateConfig({ fontSize: this.fontSize().toString() });
  }
}
