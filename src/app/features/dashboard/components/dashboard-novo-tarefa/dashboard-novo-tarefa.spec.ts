import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardNovoTarefa } from './dashboard-novo-tarefa';

describe('DashboardNovoTarefa', () => {
  let component: DashboardNovoTarefa;
  let fixture: ComponentFixture<DashboardNovoTarefa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardNovoTarefa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardNovoTarefa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
