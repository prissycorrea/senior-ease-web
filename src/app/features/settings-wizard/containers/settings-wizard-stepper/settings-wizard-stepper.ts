import { CdkStep } from '@angular/cdk/stepper';
import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CustomStepper } from '../../../../shared/components/custom-stepper/custom-stepper';
import { WrapperCard } from '../../../../shared/components/wrapper-card/wrapper-card';
import { FontSize } from '../../components/font-size/font-size';
import { ThemeSelection } from '../../components/theme-selection/theme-selection';
import { ThemeConfig } from '../../services/entities/config.entity';

@Component({
  selector: 'app-settings-wizard-stepper',
  imports: [WrapperCard, CustomStepper, CdkStep, ThemeSelection, FontSize],
  templateUrl: './settings-wizard-stepper.html',
  styleUrl: './settings-wizard-stepper.scss',
})
export class SettingsWizardStepper {
  private _router = inject(Router);

  public themeOption = signal<ThemeConfig>('light-theme');
  public fontSizeOption = signal<number>(16);
  public finalizeStep = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.finalizeStep()) this._router.navigate(['autenticacao']);
    });
  }
}
