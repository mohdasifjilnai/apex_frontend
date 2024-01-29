import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyExpiredDateComponent } from './policy-expired-date.component';

describe('PolicyExpiredDateComponent', () => {
  let component: PolicyExpiredDateComponent;
  let fixture: ComponentFixture<PolicyExpiredDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyExpiredDateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyExpiredDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
