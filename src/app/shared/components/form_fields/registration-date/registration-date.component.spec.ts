import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationDateComponent } from './registration-date.component';

describe('RegistrationDateComponent', () => {
  let component: RegistrationDateComponent;
  let fixture: ComponentFixture<RegistrationDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationDateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
