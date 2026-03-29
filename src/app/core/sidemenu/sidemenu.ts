import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from '../../shared/components/button/button';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-sidemenu',
  imports: [RouterOutlet, Button],
  templateUrl: './sidemenu.html',
  styleUrl: './sidemenu.scss',
})
export class Sidemenu {
  private _authService = inject(AuthService);

  public logout() {
    this._authService.logout();
  }
}
