import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerCityComponent } from './owner-city.component';

describe('OwnerCityComponent', () => {
  let component: OwnerCityComponent;
  let fixture: ComponentFixture<OwnerCityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerCityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
