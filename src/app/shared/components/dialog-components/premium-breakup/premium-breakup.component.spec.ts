import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumBreakupComponent } from './premium-breakup.component';

describe('PremiumBreakupComponent', () => {
  let component: PremiumBreakupComponent;
  let fixture: ComponentFixture<PremiumBreakupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremiumBreakupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PremiumBreakupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
