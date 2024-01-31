import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousInsurerComponent } from './previous-insurer.component';

describe('PreviousInsurerComponent', () => {
  let component: PreviousInsurerComponent;
  let fixture: ComponentFixture<PreviousInsurerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreviousInsurerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreviousInsurerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
