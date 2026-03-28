import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAgendamento } from './dashboard-agendamento';

describe('DashboardAgendamento', () => {
  let component: DashboardAgendamento;
  let fixture: ComponentFixture<DashboardAgendamento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAgendamento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAgendamento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
