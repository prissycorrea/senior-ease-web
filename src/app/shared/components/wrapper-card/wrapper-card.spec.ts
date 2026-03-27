import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrapperCard } from './wrapper-card';

describe('WrapperCard', () => {
  let component: WrapperCard;
  let fixture: ComponentFixture<WrapperCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WrapperCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WrapperCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
