import { Component, input } from '@angular/core';
import { Header } from '../../../core/header/header';

@Component({
  selector: 'app-wrapper-card',
  imports: [Header],
  templateUrl: './wrapper-card.html',
  styleUrl: './wrapper-card.scss',
})
export class WrapperCard {
  public noHeader = input<boolean>(false);
}
