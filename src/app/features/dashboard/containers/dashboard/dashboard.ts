import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../../../shared/components/button/button';
import { ProgressBar } from '../../../../shared/components/progress-bar/progress-bar';
import { AuthService } from '../../../../shared/services/auth.service';
import { DashboardHeader } from './../../components/dashboard-header/dashboard-header';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardHeader, Button, ProgressBar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);

  get user() {
    return this._authService.user;
  }

  public redirectToNewTask() {
    this._router.navigate(['dashboard/nova-tarefa']);
  }
}
