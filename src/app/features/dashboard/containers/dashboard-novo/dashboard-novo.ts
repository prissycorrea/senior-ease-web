import { CdkStep } from '@angular/cdk/stepper';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomStepper } from '../../../../shared/components/custom-stepper/custom-stepper';
import { WrapperCard } from '../../../../shared/components/wrapper-card/wrapper-card';
import { DashboardNovoTarefa } from '../../components/dashboard-novo-tarefa/dashboard-novo-tarefa';
import { dashboardNovoForm } from '../../services/dashboard-novo.form';

@Component({
  selector: 'app-dashboard-novo',
  imports: [WrapperCard, CustomStepper, CdkStep, DashboardNovoTarefa, ReactiveFormsModule],
  templateUrl: './dashboard-novo.html',
  styleUrl: './dashboard-novo.scss',
})
export class DashboardNovo {
  public form = dashboardNovoForm().form;

  public cadastrarTarefa() {
    console.log(this.form.value);
  }
}
