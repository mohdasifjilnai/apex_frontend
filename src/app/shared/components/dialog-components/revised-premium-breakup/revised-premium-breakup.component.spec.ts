import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisedPremiumBreakupComponent } from './revised-premium-breakup.component';

describe('RevisedPremiumBreakupComponent', () => {
  let component: RevisedPremiumBreakupComponent;
  let fixture: ComponentFixture<RevisedPremiumBreakupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisedPremiumBreakupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevisedPremiumBreakupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
