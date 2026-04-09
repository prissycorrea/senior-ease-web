import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjustesProfile } from './ajustes-profile';

describe('AjustesProfile', () => {
  let component: AjustesProfile;
  let fixture: ComponentFixture<AjustesProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjustesProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjustesProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
