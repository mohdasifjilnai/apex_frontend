import { TestBed } from '@angular/core/testing';

import { GlobalLoaderInterceptor } from './global-loader.interceptor';

describe('GlobalLoaderInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      GlobalLoaderInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: GlobalLoaderInterceptor = TestBed.inject(GlobalLoaderInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
