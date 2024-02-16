import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalShareComponent } from './proposal-share.component';

describe('ProposalShareComponent', () => {
  let component: ProposalShareComponent;
  let fixture: ComponentFixture<ProposalShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalShareComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
