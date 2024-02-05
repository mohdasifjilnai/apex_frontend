import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalVehicleDetailsComponent } from './proposal-vehicle-details.component';

describe('ProposalVehicleDetailsComponent', () => {
  let component: ProposalVehicleDetailsComponent;
  let fixture: ComponentFixture<ProposalVehicleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalVehicleDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalVehicleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
