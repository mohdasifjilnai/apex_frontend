import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationNumberComponent } from './registration-number.component';

describe('RegistrationNumberComponent', () => {
  let component: RegistrationNumberComponent;
  let fixture: ComponentFixture<RegistrationNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrationNumberComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
