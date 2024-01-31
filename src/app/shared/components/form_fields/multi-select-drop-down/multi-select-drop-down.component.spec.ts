import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectDropDownComponent } from './multi-select-drop-down.component';

describe('MultiSelectDropDownComponent', () => {
  let component: MultiSelectDropDownComponent;
  let fixture: ComponentFixture<MultiSelectDropDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiSelectDropDownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiSelectDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
