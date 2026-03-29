import { Component, inject, signal } from '@angular/core';
import { Button } from "../../../../shared/components/button/button";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard-agendamento-time',
  imports: [Button],
  templateUrl: './dashboard-agendamento-time.html',
  styleUrl: './dashboard-agendamento-time.scss',
})
export class DashboardAgendamentoTime {
  private readonly _dialogRef = inject(MatDialogRef);
  public horarios = signal<string[]>([]);
  public horarioSelecionado = signal<string>('');

  constructor() {
    this._gerarHorarios();
  }

  private _gerarHorarios() {
    const passo = 30;
    const totalMinutosNoDia = 24 * 60;

    for (let minutos = 0; minutos < totalMinutosNoDia; minutos += passo) {
      const horas = Math.floor(minutos / 60);
      const mins = minutos % 60;

      const horarioFormatado = `${horas.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

      this.horarios.update((prev) => [...prev, horarioFormatado]);
    }
  }

  public selecionar(horario: string) {
    this.horarioSelecionado.set(horario);
  }

  public salvarHorario() {
    this._dialogRef.close(this.horarioSelecionado());
  }
}
