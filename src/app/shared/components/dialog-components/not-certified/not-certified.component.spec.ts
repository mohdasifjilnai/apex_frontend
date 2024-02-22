import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotCertifiedComponent } from './not-certified.component';

describe('NotCertifiedComponent', () => {
  let component: NotCertifiedComponent;
  let fixture: ComponentFixture<NotCertifiedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotCertifiedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotCertifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
