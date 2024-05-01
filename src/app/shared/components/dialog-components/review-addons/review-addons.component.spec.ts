import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAddonsComponent } from './review-addons.component';

describe('ReviewAddonsComponent', () => {
  let component: ReviewAddonsComponent;
  let fixture: ComponentFixture<ReviewAddonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewAddonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewAddonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
