import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailsCardComponent } from './vehicle-details-card.component';

describe('VehicleDetailsCardComponent', () => {
  let component: VehicleDetailsCardComponent;
  let fixture: ComponentFixture<VehicleDetailsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleDetailsCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
