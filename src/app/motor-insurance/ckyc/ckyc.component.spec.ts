import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CkycComponent } from './ckyc.component';

describe('CkycComponent', () => {
  let component: CkycComponent;
  let fixture: ComponentFixture<CkycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CkycComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CkycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
