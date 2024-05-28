import { TestBed } from '@angular/core/testing';

import { SetHeaderService } from './set-header.service';

describe('SetHeaderService', () => {
  let service: SetHeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetHeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
