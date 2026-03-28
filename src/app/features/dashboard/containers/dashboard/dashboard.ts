import { Component } from '@angular/core';
import { DashboardHeader } from './../../components/dashboard-header/dashboard-header';
import { Button } from "../../../../shared/components/button/button";
import { ProgressBar } from "../../../../shared/components/progress-bar/progress-bar";

@Component({
  selector: 'app-dashboard',
  imports: [DashboardHeader, Button, ProgressBar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
