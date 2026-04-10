import { Component, effect, forwardRef, inject, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DashboardAgendamentoTime } from '../dashboard-agendamento-time/dashboard-agendamento-time';
interface DiaAgendamento {
  data: Date;
  label: string;
  isHoje: boolean;
  isAmanha: boolean;
}
@Component({
  selector: 'app-dashboard-agendamento',
  imports: [],
  templateUrl: './dashboard-agendamento.html',
  styleUrl: './dashboard-agendamento.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DashboardAgendamento),
      multi: true,
    },
  ],
})
export class DashboardAgendamento implements ControlValueAccessor {
  private readonly _dialog = inject(MatDialog);
  // Signals para performance e reatividade
  readonly hoje = signal<DiaAgendamento | null>(null);
  readonly amanha = signal<DiaAgendamento | null>(null);
  readonly proximosDias = signal<DiaAgendamento[]>([]);

  // Armazena a data selecionada (Date ou string formatada)
  readonly dataSelecionada = signal<Date | null>(null);
  private readonly _dataSelecionada = signal<string>('');

  constructor() {
    effect(() => {
      this.onChanged(this._dataSelecionada());
    });
  }

  ngOnInit() {
    this._gerarDatas();
  }

  private _gerarDatas() {
    const listaDias: DiaAgendamento[] = [];
    const locale = 'pt-BR';

    for (let i = 0; i < 8; i++) {
      const d = new Date();

      d.setHours(0, 0, 0, 0);

      d.setDate(d.getDate() + i);

      const dia: DiaAgendamento = {
        data: d,
        label: d.toLocaleDateString(locale, { weekday: 'long' }),
        isHoje: i === 0,
        isAmanha: i === 1,
      };

      // Capitaliza: "segunda-feira" -> "Segunda-feira"
      dia.label = dia.label.charAt(0).toUpperCase() + dia.label.slice(1);

      if (i === 0) this.hoje.set(dia);
      else if (i === 1) this.amanha.set(dia);
      else listaDias.push(dia);
    }

    this.proximosDias.set(listaDias);
  }

  selecionar(dia: DiaAgendamento) {
    const dialogRef = this._dialog.open(DashboardAgendamentoTime, {
      minWidth: '40vw',
      minHeight: '40vw',
      disableClose: true,
      autoFocus: true,
    });

    dialogRef.afterClosed().subscribe((horario: string) => {
      const data = dia.data.toISOString().split('T')[0];
      const dataLocal = new Date(`${data} ${horario}`);

      this.dataSelecionada.set(dia.data);
      this._dataSelecionada.set(dataLocal.toISOString());
    });
  }

  onChanged = (val: any) => {};
  onTouched = (val: any) => {};

  writeValue(val: any): void {
    this.dataSelecionada.set(val);
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
