import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAgendamentoTime } from './dashboard-agendamento-time';

describe('DashboardAgendamentoTime', () => {
  let component: DashboardAgendamentoTime;
  let fixture: ComponentFixture<DashboardAgendamentoTime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAgendamentoTime]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAgendamentoTime);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
