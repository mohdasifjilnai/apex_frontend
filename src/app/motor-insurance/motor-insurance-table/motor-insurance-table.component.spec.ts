import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorInsuranceTableComponent } from './motor-insurance-table.component';

describe('MotorInsuranceTableComponent', () => {
  let component: MotorInsuranceTableComponent;
  let fixture: ComponentFixture<MotorInsuranceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotorInsuranceTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotorInsuranceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
