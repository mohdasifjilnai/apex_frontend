import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufactureDateComponent } from './manufacture-date.component';

describe('ManufactureDateComponent', () => {
  let component: ManufactureDateComponent;
  let fixture: ComponentFixture<ManufactureDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManufactureDateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ManufactureDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
