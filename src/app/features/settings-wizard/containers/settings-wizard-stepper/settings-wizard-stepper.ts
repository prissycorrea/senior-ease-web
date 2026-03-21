import { CdkStep } from '@angular/cdk/stepper';
import { Component, effect, signal } from '@angular/core';
import { CustomStepper } from '../../../../shared/components/custom-stepper/custom-stepper';
import { WrapperCard } from '../../../../shared/components/wrapper-card/wrapper-card';
import { FontSize } from '../../components/font-size/font-size';
import { ThemeSelection } from '../../components/theme-selection/theme-selection';

@Component({
  selector: 'app-settings-wizard-stepper',
  imports: [WrapperCard, CustomStepper, CdkStep, ThemeSelection, FontSize],
  templateUrl: './settings-wizard-stepper.html',
  styleUrl: './settings-wizard-stepper.scss',
})
export class SettingsWizardStepper {
  themeOption = signal<string>('light-theme');
  fontSizeOption = signal<number>(16);

  constructor() {
    effect(() => {
      localStorage.setItem('theme', this.themeOption());
      localStorage.setItem('fontSize', this.fontSizeOption().toString());
    });
  }
}
