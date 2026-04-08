import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthRoot } from '../auth-root';

describe('AuthRoot', () => {
  let component: AuthRoot;
  let fixture: ComponentFixture<AuthRoot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthRoot],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthRoot);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
