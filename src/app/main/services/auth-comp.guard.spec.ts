import { TestBed } from '@angular/core/testing';

import { AuthCompGuard } from './auth-comp.guard';

describe('AuthCompGuard', () => {
  let guard: AuthCompGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthCompGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
