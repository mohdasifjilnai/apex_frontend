import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleRegistrationNumberComponent } from './vehicle-registration-number.component';

describe('VehicleRegistrationNumberComponent', () => {
  let component: VehicleRegistrationNumberComponent;
  let fixture: ComponentFixture<VehicleRegistrationNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleRegistrationNumberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleRegistrationNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
