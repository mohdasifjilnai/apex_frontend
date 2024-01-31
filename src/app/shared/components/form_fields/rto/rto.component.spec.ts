import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RTOComponent } from './rto.component';

describe('RTOComponent', () => {
  let component: RTOComponent;
  let fixture: ComponentFixture<RTOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RTOComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RTOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
