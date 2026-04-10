import { Component, effect, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-ajustes-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './ajustes-profile.html',
  styleUrl: './ajustes-profile.scss',
})
export class AjustesProfile {
  private readonly _profileService = inject(ProfileService);
  public isUploading = false;

  public hidePassword = signal(true);
  public hideConfirmPassword = signal(true);
  public messageSuccess = signal('');
  public messageError = signal('');
  public loadingProfile = this._profileService.loadingProfile;

  public perfilForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required]),
      email: new FormControl({ value: '', disabled: true }),
      password: new FormControl('', [Validators.minLength(6)]),
      confirmPassword: new FormControl(''),
    },
    { validators: this.passwordMatchValidator },
  );

  constructor() {
    effect(() => {
      const user = this._profileService.profile();
      if (user) {
        this.perfilForm.patchValue({
          name: user.name,
          email: user.email,
        });
      }
    });
  }

  async saveProfile() {
    if (this.perfilForm.valid) {
      const { name, password } = this.perfilForm.getRawValue();

      try {
        // 1. Atualiza o Nome no Firestore
        if (name) {
          await this._profileService.updateProfileData({ name });
        }

        // 2. Atualiza a Senha no Auth (se o campo não estiver vazio)
        if (password && password.trim().length >= 6) {
          await this._profileService.changePassword(password);
          // Limpa o campo de senha após sucesso por segurança
          this.perfilForm.get('password')?.reset();
          this.perfilForm.get('confirmPassword')?.reset();
        }

        this.messageSuccess.set('Perfil e senha atualizados com sucesso!');
      } catch (error: any) {
        if (error.code === 'auth/requires-recent-login') {
          this.messageError.set(
            'Para mudar a senha, você precisa ter feito login recentemente. Por favor, saia e entre de novo.',
          );
        } else {
          console.error('Erro ao salvar:', error);
          this.messageError.set('Erro ao atualizar dados.');
        }
      }
    }
  }

  togglePassword() {
    this.hidePassword.update((v) => !v);
  }

  toggleConfirmPassword() {
    this.hideConfirmPassword.update((v) => !v);
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
