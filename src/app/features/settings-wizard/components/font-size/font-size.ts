import { Component, output, signal } from '@angular/core';
import { Button } from "../../../../shared/components/button/button";

@Component({
  selector: 'app-font-size',
  imports: [Button],
  templateUrl: './font-size.html',
  styleUrl: './font-size.scss',
})
export class FontSize {
  public fontSize = signal<number>(16);
  public fontSizeEmit = output<number>();

  public increaseFontSize() {
    this.fontSize.update((fontSize) => fontSize + 4);
  }

  public decreaseFontSize() {
    this.fontSize.update((fontSize) => fontSize - 4);
  }
}
