import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCadastro } from './auth-cadastro';

describe('AuthCadastro', () => {
  let component: AuthCadastro;
  let fixture: ComponentFixture<AuthCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthCadastro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthCadastro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
