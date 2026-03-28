import { Component, effect, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
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
  // Signals para performance e reatividade
  readonly hoje = signal<DiaAgendamento | null>(null);
  readonly amanha = signal<DiaAgendamento | null>(null);
  readonly proximosDias = signal<DiaAgendamento[]>([]);

  // Armazena a data selecionada (Date ou string formatada)
  readonly dataSelecionada = signal<Date | null>(null);

  constructor() {
    effect(() => {
      this.onChanged(this.dataSelecionada());
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
    this.dataSelecionada.set(dia.data);
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
