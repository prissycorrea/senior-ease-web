import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../../../shared/components/button/button';
import { ProgressBar } from '../../../../shared/components/progress-bar/progress-bar';
import { AuthService } from '../../../../shared/services/auth.service';
import { Task } from '../../services/entities/dashboard-novo.entity';
import { TaskService } from '../../services/task.service';
import { DashboardHeader } from './../../components/dashboard-header/dashboard-header';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardHeader, Button, ProgressBar, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly _service = inject(TaskService);

  public tasks = this._service.tasks;
  public completedActivitiesInPercent = this._service.completedActivitiesInPercent;
  public tasksPendents = this._service.tasksPendents;
  public tasksCompleted = this._service.tasksCompleted;

  get user() {
    return this._authService.user;
  }

  public redirectToNewTask() {
    this._router.navigate(['dashboard/nova-tarefa']);
  }

  public markActivityAsCompleted(task: Task) {
    this._service.updateTask(task.id!, { completed: true });
  }
}
