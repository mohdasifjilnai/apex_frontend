import { TestBed } from '@angular/core/testing';

import { QuotesLoaderService } from './quotes-loader.service';

describe('QuotesLoaderService', () => {
  let service: QuotesLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuotesLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
