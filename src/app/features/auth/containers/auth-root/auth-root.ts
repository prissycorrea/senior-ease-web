import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { Button } from '../../../../shared/components/button/button';
import { WrapperCard } from '../../../../shared/components/wrapper-card/wrapper-card';

@Component({
  selector: 'app-auth-root',
  imports: [WrapperCard, Button, RouterOutlet, RouterLink],
  templateUrl: './auth-root.html',
  styleUrl: './auth-root.scss',
})
export class AuthRoot {
  private _router = inject(Router);
  private _route = inject(ActivatedRoute); // Monitora as mudanças de navegação e retorna se existe uma rota filha
  private navEnd = toSignal(
    this._router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this._route.firstChild !== null),
    ),
  );

  // Signal que você usará no HTML
  public isChildRouteActive = computed(() => this.navEnd() ?? false);
}
