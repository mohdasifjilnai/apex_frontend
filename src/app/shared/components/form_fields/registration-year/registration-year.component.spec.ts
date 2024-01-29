import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationYearComponent } from './registration-year.component';

describe('RegistrationYearComponent', () => {
  let component: RegistrationYearComponent;
  let fixture: ComponentFixture<RegistrationYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationYearComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
