import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedShareComponent } from './selected-share.component';

describe('SelectedShareComponent', () => {
  let component: SelectedShareComponent;
  let fixture: ComponentFixture<SelectedShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedShareComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
