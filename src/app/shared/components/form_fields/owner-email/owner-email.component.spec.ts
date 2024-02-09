import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerEmailComponent } from './owner-email.component';

describe('OwnerEmailComponent', () => {
  let component: OwnerEmailComponent;
  let fixture: ComponentFixture<OwnerEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerEmailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
