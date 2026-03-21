// import { CdkStepper } from '@angular/cdk/stepper';
import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';
import { Component, output } from '@angular/core';

@Component({
  selector: 'app-custom-stepper',
  imports: [CdkStepperModule, NgTemplateOutlet],
  templateUrl: './custom-stepper.html',
  styleUrl: './custom-stepper.scss',
  providers: [{ provide: CdkStepper, useExisting: CustomStepper }],
})
export class CustomStepper extends CdkStepper {
  public nextEmit = output<number>();
  public previousEmit = output<number>();

  onClick(index: number): void {
    this.selectedIndex = index;
  }
}
