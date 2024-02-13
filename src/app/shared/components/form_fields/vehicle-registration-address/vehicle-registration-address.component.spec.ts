import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleRegistrationAddressComponent } from './vehicle-registration-address.component';

describe('VehicleRegistrationAddressComponent', () => {
  let component: VehicleRegistrationAddressComponent;
  let fixture: ComponentFixture<VehicleRegistrationAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleRegistrationAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleRegistrationAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
