import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotesDropdownComponent } from './quotes-dropdown.component';

describe('QuotesDropdownComponent', () => {
  let component: QuotesDropdownComponent;
  let fixture: ComponentFixture<QuotesDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotesDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotesDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
