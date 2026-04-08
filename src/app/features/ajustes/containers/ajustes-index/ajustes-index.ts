import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WrapperCard } from '../../../../shared/components/wrapper-card/wrapper-card';

@Component({
  selector: 'app-ajustes-index',
  imports: [WrapperCard, RouterOutlet],
  templateUrl: './ajustes-index.html',
  styleUrl: './ajustes-index.scss',
})
export class AjustesIndex {}
