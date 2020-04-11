import { TestBed } from '@angular/core/testing';

import { SlidedataService } from './slidedata.service';

describe('SlidedataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SlidedataService = TestBed.get(SlidedataService);
    expect(service).toBeTruthy();
  });
});
