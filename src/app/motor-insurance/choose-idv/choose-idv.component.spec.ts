import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseIDVComponent } from './choose-idv.component';

describe('ChooseIDVComponent', () => {
  let component: ChooseIDVComponent;
  let fixture: ComponentFixture<ChooseIDVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChooseIDVComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChooseIDVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
