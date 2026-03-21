import { Component } from '@angular/core';
import { WrapperCard } from '../../../../shared/components/wrapper-card/wrapper-card';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-settings-wizard-stepper',
  imports: [WrapperCard, RouterOutlet],
  templateUrl: './settings-wizard-stepper.html',
  styleUrl: './settings-wizard-stepper.scss',
})
export class SettingsWizardStepper {

}
