import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleOwnerDetailsComponent } from './vehicle-owner-details.component';

describe('VehicleOwnerDetailsComponent', () => {
  let component: VehicleOwnerDetailsComponent;
  let fixture: ComponentFixture<VehicleOwnerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleOwnerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleOwnerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
