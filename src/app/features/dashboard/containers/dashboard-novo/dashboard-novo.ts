import { CdkStep } from '@angular/cdk/stepper';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomStepper } from '../../../../shared/components/custom-stepper/custom-stepper';
import { WrapperCard } from '../../../../shared/components/wrapper-card/wrapper-card';
import { DashboardNovoTarefa } from '../../components/dashboard-novo-tarefa/dashboard-novo-tarefa';
import { dashboardNovoForm } from '../../services/dashboard-novo.form';
import { DashboardAgendamento } from "../../components/dashboard-agendamento/dashboard-agendamento";
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-novo',
  imports: [WrapperCard, CustomStepper, CdkStep, DashboardNovoTarefa, ReactiveFormsModule, DashboardAgendamento],
  templateUrl: './dashboard-novo.html',
  styleUrl: './dashboard-novo.scss',
})
export class DashboardNovo {
  public _router = inject(Router);
  public form = dashboardNovoForm().form;

  public cadastrarTarefa() {
    this._router.navigate(['/dashboard/feedback'], {
      state: {
        type: 'success',
        label: 'Muito bem!',
        message: 'Tudo anotado. Seu compromisso foi salvo com sucesso.',
        actionRoute: '/dashboard',
        actionLabel: 'Voltar ao início',
      },
    });
  }
}
