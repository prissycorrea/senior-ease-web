import { Component } from '@angular/core';
import { WrapperCard } from "../../shared/components/wrapper-card/wrapper-card";
import { CustomStepper } from "../../shared/components/custom-stepper/custom-stepper";
import { CdkStep } from "@angular/cdk/stepper";

@Component({
  selector: 'app-dashboard',
  imports: [WrapperCard, CustomStepper, CdkStep],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

}
