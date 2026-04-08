import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Input),
      multi: true,
    },
  ],
})
export class Input implements ControlValueAccessor {
  protected value = signal<string>('');
  protected isDisabled = signal<boolean>(false);
  protected readonly inputId: string = `input-${Math.random().toString(36).substring(2, 9)}`;

  public label = input<string>('');
  public inputLabel = input<string>('');
  public type = input<'text' | 'email' | 'password'>('text');
  public placeholder = input<string>('');
  public id = input<string>(this.inputId);
  // Funções de callback que o Angular vai nos passar
  onChange: any = () => {};
  onTouched: any = () => {};

  // 1. O Angular chama isso quando o valor muda de FORA para DENTRO
  writeValue(val: string): void {
    this.value.set(val || '');
  }

  // 2. O Angular nos passa a função que devemos chamar quando o valor muda DENTRO
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // 3. O Angular nos passa a função para quando o input for "tocado" (blur)
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  // Método para atualizar o valor e avisar o formulário pai
  onInput(event: Event) {
    if (this.isDisabled()) return; // Early return por segurança

    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.onChange(val); // <--- AQUI o pai (FormGroup) fica sabendo do novo valor
  }
}
