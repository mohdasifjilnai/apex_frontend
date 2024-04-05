import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalExpiredComponent } from './proposal-expired.component';

describe('ProposalExpiredComponent', () => {
  let component: ProposalExpiredComponent;
  let fixture: ComponentFixture<ProposalExpiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalExpiredComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalExpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
