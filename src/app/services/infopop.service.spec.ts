import { TestBed } from '@angular/core/testing';

import { InfopopService } from './infopop.service';

describe('InfopopService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InfopopService = TestBed.get(InfopopService);
    expect(service).toBeTruthy();
  });
});
