import { Component } from '@angular/core';
import { WrapperCard } from '../../../../shared/components/wrapper-card/wrapper-card';
import { RouterOutlet } from '@angular/router';
import { CustomStepper } from '../../../../shared/components/custom-stepper/custom-stepper';
import { CdkStep } from "@angular/cdk/stepper";

@Component({
  selector: 'app-settings-wizard-stepper',
  imports: [WrapperCard, CustomStepper, CdkStep],
  templateUrl: './settings-wizard-stepper.html',
  styleUrl: './settings-wizard-stepper.scss',
})
export class SettingsWizardStepper {

}
