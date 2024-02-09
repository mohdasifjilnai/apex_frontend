import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerFullNameComponent } from './owner-full-name.component';

describe('OwnerFullNameComponent', () => {
  let component: OwnerFullNameComponent;
  let fixture: ComponentFixture<OwnerFullNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OwnerFullNameComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OwnerFullNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
