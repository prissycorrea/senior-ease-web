import { CdkStep } from '@angular/cdk/stepper';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomStepper } from '../../../../shared/components/custom-stepper/custom-stepper';
import { AuthInput } from '../../components/auth-input/auth-input';
import { authCadastroForm } from '../../services/forms/auth-cadastro.form';

@Component({
  selector: 'app-auth-cadastro',
  imports: [CustomStepper, CdkStep, AuthInput, ReactiveFormsModule],
  templateUrl: './auth-cadastro.html',
  styleUrl: './auth-cadastro.scss',
})
export class AuthCadastro {
  public form = authCadastroForm().form;
}
