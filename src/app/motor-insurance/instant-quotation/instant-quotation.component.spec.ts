import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantQuotationComponent } from './instant-quotation.component';

describe('InstantQuotationComponent', () => {
  let component: InstantQuotationComponent;
  let fixture: ComponentFixture<InstantQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstantQuotationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstantQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
