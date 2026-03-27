import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsWizardStepper } from './settings-wizard-stepper';

describe('SettingsWizardStepper', () => {
  let component: SettingsWizardStepper;
  let fixture: ComponentFixture<SettingsWizardStepper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsWizardStepper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsWizardStepper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
