import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailsPopupComponent } from './vehicle-details-popup.component';

describe('VehicleDetailsPopupComponent', () => {
  let component: VehicleDetailsPopupComponent;
  let fixture: ComponentFixture<VehicleDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VehicleDetailsPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VehicleDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
