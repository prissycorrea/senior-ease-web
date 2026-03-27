import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FontSize } from './font-size';

describe('FontSize', () => {
  let component: FontSize;
  let fixture: ComponentFixture<FontSize>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FontSize]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FontSize);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
