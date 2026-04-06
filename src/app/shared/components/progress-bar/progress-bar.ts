import { PercentPipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  imports: [PercentPipe],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss',
})
export class ProgressBar {
  public value = input<number>(0);
}
