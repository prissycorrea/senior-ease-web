import { CdkStep } from '@angular/cdk/stepper';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomStepper } from '../../../../shared/components/custom-stepper/custom-stepper';
import { WrapperCard } from '../../../../shared/components/wrapper-card/wrapper-card';
import { DashboardAgendamento } from '../../components/dashboard-agendamento/dashboard-agendamento';
import { DashboardNovoTarefa } from '../../components/dashboard-novo-tarefa/dashboard-novo-tarefa';
import { dashboardNovoForm } from '../../services/dashboard-novo.form';
import { Task } from '../../services/entities/dashboard-novo.entity';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-dashboard-novo',
  imports: [
    WrapperCard,
    CustomStepper,
    CdkStep,
    DashboardNovoTarefa,
    ReactiveFormsModule,
    DashboardAgendamento,
  ],
  templateUrl: './dashboard-novo.html',
  styleUrl: './dashboard-novo.scss',
})
export class DashboardNovo {
  private readonly _router = inject(Router);
  private readonly _service = inject(TaskService);

  public form = dashboardNovoForm().form;
  public isCreating = this._service.isCreating;
  public isUpdating = this._service.isUpdating;
  public isDeleting = this._service.isDeleting;

  public cadastrarTarefa() {
    const taskData: Task = {
      task: this.form.value.step1?.task!,
      period: this.form.value.step2?.period!,
      completed: false,
      createdAt: new Date(),
    };

    this._service
      .addTask(taskData)
      .then(() => {
        this._router.navigate(['/dashboard/feedback'], {
          state: {
            type: 'success',
            label: 'Muito bem!',
            message: 'Tudo anotado. Seu compromisso foi salvo com sucesso.',
            actionRoute: '/dashboard',
            actionLabel: 'Voltar ao início',
          },
        });
      })
      .catch((error) => {
        console.error('Erro ao salvar no Firebase:', error);
      });
  }
}
