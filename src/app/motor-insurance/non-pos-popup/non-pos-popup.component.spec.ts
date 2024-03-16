import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonPosPopupComponent } from './non-pos-popup.component';

describe('NonPosPopupComponent', () => {
  let component: NonPosPopupComponent;
  let fixture: ComponentFixture<NonPosPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonPosPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonPosPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
