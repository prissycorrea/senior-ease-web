import { Component, inject, signal, computed } from '@angular/core';
import { Button } from "../../../../shared/components/button/button";
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-agendamento-time',
  standalone: true,
  imports: [Button, FormsModule],
  templateUrl: './dashboard-agendamento-time.html',
  styleUrl: './dashboard-agendamento-time.scss',
})
export class DashboardAgendamentoTime {
  private readonly _dialogRef = inject(MatDialogRef);

  // Gera 00 até 23
  public listaHoras = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));

  // Gera 00 até 59
  public listaMinutos = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  public horaSelecionada = signal<string>('08');
  public minutoSelecionado = signal<string>('00');

  // O computed une os dois valores sempre que um deles muda
  public horarioFormatado = computed(() =>
    `${this.horaSelecionada()}:${this.minutoSelecionado()}`
  );

  public salvarHorario() {
    this._dialogRef.close(this.horarioFormatado());
  }
}
