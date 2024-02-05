import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceedInspectionComponent } from './proceed-inspection.component';

describe('ProceedInspectionComponent', () => {
  let component: ProceedInspectionComponent;
  let fixture: ComponentFixture<ProceedInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProceedInspectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProceedInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
