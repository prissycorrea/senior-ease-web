import { CdkStep } from '@angular/cdk/stepper';
import { Component, signal } from '@angular/core';
import { CustomStepper } from '../../../../shared/components/custom-stepper/custom-stepper';
import { WrapperCard } from '../../../../shared/components/wrapper-card/wrapper-card';
import { ThemeSelection } from '../../components/theme-selection/theme-selection';

@Component({
  selector: 'app-settings-wizard-stepper',
  imports: [WrapperCard, CustomStepper, CdkStep, ThemeSelection],
  templateUrl: './settings-wizard-stepper.html',
  styleUrl: './settings-wizard-stepper.scss',
})
export class SettingsWizardStepper {
  themeOption = signal<string>('light-theme');
}
