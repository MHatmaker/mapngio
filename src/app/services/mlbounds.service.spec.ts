import { TestBed } from '@angular/core/testing';

import { MlboundsService } from './mlbounds.service';

describe('MlboundsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MlboundsService = TestBed.get(MlboundsService);
    expect(service).toBeTruthy();
  });
});
