import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChasisNumberComponent } from './chasis-number.component';

describe('ChasisNumberComponent', () => {
  let component: ChasisNumberComponent;
  let fixture: ComponentFixture<ChasisNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChasisNumberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChasisNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
