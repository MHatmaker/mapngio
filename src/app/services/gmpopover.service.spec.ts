import { TestBed } from '@angular/core/testing';

import { GmpopoverService } from './gmpopover.service';

describe('GmpopoverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GmpopoverService = TestBed.get(GmpopoverService);
    expect(service).toBeTruthy();
  });
});
