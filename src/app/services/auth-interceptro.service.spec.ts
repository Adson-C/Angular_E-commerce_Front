import { TestBed } from '@angular/core/testing';

import { AuthInterceptroService } from './auth-interceptro.service';

describe('AuthInterceptroService', () => {
  let service: AuthInterceptroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthInterceptroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
