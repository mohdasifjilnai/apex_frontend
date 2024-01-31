import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumBreakupCardComponent } from './premium-breakup-card.component';

describe('PremiumBreakupCardComponent', () => {
  let component: PremiumBreakupCardComponent;
  let fixture: ComponentFixture<PremiumBreakupCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PremiumBreakupCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PremiumBreakupCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
