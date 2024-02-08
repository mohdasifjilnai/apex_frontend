import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitCkycVerificationDialogComponent } from './wait-ckyc-verification-dialog.component';

describe('WaitCkycVerificationDialogComponent', () => {
  let component: WaitCkycVerificationDialogComponent;
  let fixture: ComponentFixture<WaitCkycVerificationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaitCkycVerificationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitCkycVerificationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
