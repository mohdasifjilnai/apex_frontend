import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CkycDocumentsComponent } from './ckyc-documents.component';

describe('CkycDocumentsComponent', () => {
  let component: CkycDocumentsComponent;
  let fixture: ComponentFixture<CkycDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CkycDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CkycDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
