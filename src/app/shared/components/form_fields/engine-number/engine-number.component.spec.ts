import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngineNumberComponent } from './engine-number.component';

describe('EngineNumberComponent', () => {
  let component: EngineNumberComponent;
  let fixture: ComponentFixture<EngineNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EngineNumberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EngineNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
