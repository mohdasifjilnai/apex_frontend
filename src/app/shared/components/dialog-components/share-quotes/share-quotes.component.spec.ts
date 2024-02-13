import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareQuotesComponent } from './share-quotes.component';

describe('ShareQuotesComponent', () => {
  let component: ShareQuotesComponent;
  let fixture: ComponentFixture<ShareQuotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareQuotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
