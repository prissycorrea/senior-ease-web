import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from '../../shared/components/button/button';

@Component({
  selector: 'app-sidemenu',
  imports: [RouterOutlet, Button],
  templateUrl: './sidemenu.html',
  styleUrl: './sidemenu.scss',
})
export class Sidemenu {}
