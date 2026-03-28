import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardNovo } from './dashboard-novo';

describe('DashboardNovo', () => {
  let component: DashboardNovo;
  let fixture: ComponentFixture<DashboardNovo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardNovo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardNovo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
