import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Button } from '../button/button';
import { WrapperCard } from '../wrapper-card/wrapper-card';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-feedback',
  imports: [WrapperCard, Button, JsonPipe, RouterLink],
  templateUrl: './feedback.html',
  styleUrl: './feedback.scss',
})
export class Feedback {
  private _router = inject(Router);

  public type = input<'success' | 'warning' | 'error' | 'info'>('success');
  public label = input<string>('');
  public message = input<string>('');
  public state = signal<any>(null);
  public actionLabel = input<string>('Voltar ao início');
  public actionRoute = input<string>('');

  constructor() {
    const navigationState = history.state;

    if (navigationState && navigationState.type) {
      this.state.set(navigationState);
    }
  }
}
