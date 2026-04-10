import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaIndex } from './agenda-index';

describe('AgendaIndex', () => {
  let component: AgendaIndex;
  let fixture: ComponentFixture<AgendaIndex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendaIndex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendaIndex);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
