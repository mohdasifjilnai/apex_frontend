import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetailsPopupNewComponent } from './vehicle-details-popup-new.component';

describe('VehicleDetailsPopupNewComponent', () => {
  let component: VehicleDetailsPopupNewComponent;
  let fixture: ComponentFixture<VehicleDetailsPopupNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleDetailsPopupNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDetailsPopupNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
