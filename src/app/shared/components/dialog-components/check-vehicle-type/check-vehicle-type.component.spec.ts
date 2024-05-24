import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckVehicleTypeComponent } from './check-vehicle-type.component';

describe('CheckVehicleTypeComponent', () => {
  let component: CheckVehicleTypeComponent;
  let fixture: ComponentFixture<CheckVehicleTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckVehicleTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckVehicleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
