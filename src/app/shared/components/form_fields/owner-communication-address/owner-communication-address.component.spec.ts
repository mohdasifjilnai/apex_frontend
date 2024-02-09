import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerCommunicationAddressComponent } from './owner-communication-address.component';

describe('OwnerCommunicationAddressComponent', () => {
  let component: OwnerCommunicationAddressComponent;
  let fixture: ComponentFixture<OwnerCommunicationAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerCommunicationAddressComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerCommunicationAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
