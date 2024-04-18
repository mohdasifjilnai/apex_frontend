import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckQuotesDialogComponent } from './check-quotes-dialog.component';

describe('CheckQuotesDialogComponent', () => {
  let component: CheckQuotesDialogComponent;
  let fixture: ComponentFixture<CheckQuotesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckQuotesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckQuotesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
