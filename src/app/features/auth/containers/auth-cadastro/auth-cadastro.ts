import { CdkStep } from '@angular/cdk/stepper';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomStepper } from '../../../../shared/components/custom-stepper/custom-stepper';
import { Input } from '../../../../shared/components/input/input';
import { AuthService } from '../../../../shared/services/auth.service';
import { authCadastroForm } from '../../services/forms/auth-cadastro.form';

@Component({
  selector: 'app-auth-cadastro',
  imports: [CustomStepper, CdkStep, Input, ReactiveFormsModule],
  templateUrl: './auth-cadastro.html',
  styleUrl: './auth-cadastro.scss',
})
export class AuthCadastro {
  public form = authCadastroForm().form;
  private _router = inject(Router);
  private _authService = inject(AuthService);

  public cadastrarUsuario() {
    const { username, email, password } = {
      ...this.form.value.step1,
      ...this.form.value.step2,
      ...this.form.value.step3,
    };

    this._authService
      .cadastrar(username!, email!, password!)
      .then(() => {
        this._router.navigate(['/feedback'], {
          state: {
            type: 'success',
            label: 'Tudo certinho!',
            message: 'Seu cadastro foi realizado. Agora vamos cuidar da sua rotina juntos.',
            actionRoute: '/autenticacao/login',
            actionLabel: 'Acessar sua conta',
          },
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
