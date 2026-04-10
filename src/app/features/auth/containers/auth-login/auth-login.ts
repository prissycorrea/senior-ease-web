import { CdkStep } from '@angular/cdk/stepper';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomStepper } from '../../../../shared/components/custom-stepper/custom-stepper';
import { Input } from '../../../../shared/components/input/input';
import { AuthService } from '../../../../shared/services/auth.service';
import { authLoginForm } from '../../services/forms/auth-login.form';

@Component({
  selector: 'app-auth-login',
  imports: [CustomStepper, CdkStep, Input, ReactiveFormsModule],
  templateUrl: './auth-login.html',
  styleUrl: './auth-login.scss',
})
export class AuthLogin {
  public form = authLoginForm().form;
  private _router = inject(Router);
  private _authService = inject(AuthService);

  public isLoggingIn = this._authService.isLoggingIn;

  public logarUsuario() {
    const { email, password } = {
      ...this.form.value.step1,
      ...this.form.value.step2,
    };

    this._authService
      .login(email!, password!)
      .then(() => this._router.navigate(['/']))
      .catch((error) => {
        console.error(error);
      });
  }
}
