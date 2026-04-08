import { Component, effect, forwardRef, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { Input } from '../../../../shared/components/input/input';
import { MicControl } from '../../../../shared/components/mic-control/mic-control';

@Component({
  selector: 'app-dashboard-novo-tarefa',
  imports: [Input, MicControl, ReactiveFormsModule],
  templateUrl: './dashboard-novo-tarefa.html',
  styleUrl: './dashboard-novo-tarefa.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DashboardNovoTarefa),
      multi: true,
    },
  ],
})
export class DashboardNovoTarefa implements ControlValueAccessor {
  public taskControl = new FormControl('');
  public isRecording = signal<boolean>(false);
  public newTask = signal<string>('');

  constructor() {
    this.taskControl.valueChanges.subscribe((val) => {
      this.onChanged(val);
    });

    effect(() => {
      this.taskControl.setValue(this.newTask());
    });
  }

  onChanged = (val: string | null) => {};
  onTouched = (val: string | null) => {};

  writeValue(val: string): void {
    this.taskControl.setValue(val);
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
