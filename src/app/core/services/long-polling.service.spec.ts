import { TestBed } from '@angular/core/testing';

import { LongPollingService } from './long-polling.service';

describe('LongPollingService', () => {
  let service: LongPollingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LongPollingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
