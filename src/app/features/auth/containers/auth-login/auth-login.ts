import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-auth-login',
  imports: [],
  templateUrl: './auth-login.html',
  styleUrl: './auth-login.scss',
})
export class AuthLogin {
  private _authService = inject(AuthService);

  constructor() {
    this._authService.login('jcmagalhaes301+dev1@gmail.com', '123456');
  }
}
