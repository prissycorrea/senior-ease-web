import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicControl } from './mic-control';

describe('MicControl', () => {
  let component: MicControl;
  let fixture: ComponentFixture<MicControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MicControl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MicControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
