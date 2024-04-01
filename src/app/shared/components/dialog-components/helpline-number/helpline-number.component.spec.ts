import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelplineNumberComponent } from './helpline-number.component';

describe('HelplineNumberComponent', () => {
  let component: HelplineNumberComponent;
  let fixture: ComponentFixture<HelplineNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelplineNumberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelplineNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
