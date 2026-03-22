// import { CdkStepper } from '@angular/cdk/stepper';
import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';
import { Component, output } from '@angular/core';
import { Button } from '../button/button';

@Component({
  selector: 'app-custom-stepper',
  imports: [CdkStepperModule, NgTemplateOutlet, Button],
  templateUrl: './custom-stepper.html',
  styleUrl: './custom-stepper.scss',
  providers: [{ provide: CdkStepper, useExisting: CustomStepper }],
})
export class CustomStepper extends CdkStepper {
  public nextEmit = output<number>();
  public previousEmit = output<number>();
  public finalizeEmit = output<boolean>();

  onClick(index: number): void {
    this.selectedIndex = index;
  }

  override next(): void {
    const isLastStep = this.selectedIndex === this.steps.length - 1;

    if (isLastStep) {
      this.finalizeEmit.emit(true);
    } else {
      super.next();
    }
  }
}
