import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerStateComponent } from './owner-state.component';

describe('OwnerStateComponent', () => {
  let component: OwnerStateComponent;
  let fixture: ComponentFixture<OwnerStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerStateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
