import { CdkStep } from '@angular/cdk/stepper';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomStepper } from '../../../../shared/components/custom-stepper/custom-stepper';
import { Input } from '../../../../shared/components/input/input';
import { authCadastroForm } from '../../services/forms/auth-cadastro.form';

@Component({
  selector: 'app-auth-cadastro',
  imports: [CustomStepper, CdkStep, Input, ReactiveFormsModule],
  templateUrl: './auth-cadastro.html',
  styleUrl: './auth-cadastro.scss',
})
export class AuthCadastro {
  public form = authCadastroForm().form;
  public _router = inject(Router);

  public cadastrarUsuario() {
    this._router.navigate(['/feedback'], {
      state: {
        type: 'success',
        label: 'Tudo certinho!',
        message: 'Seu cadastro foi realizado. Agora vamos cuidar da sua rotina juntos.',
        actionRoute: '/autenticacao/login',
        actionLabel: 'Acessar sua conta',
      },
    });
  }
}
