import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjustesIndex } from './ajustes-index';

describe('AjustesIndex', () => {
  let component: AjustesIndex;
  let fixture: ComponentFixture<AjustesIndex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjustesIndex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjustesIndex);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
