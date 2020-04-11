import { TestBed } from '@angular/core/testing';

import { MaplocoptsService } from './maplocopts.service';

describe('MaplocoptsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaplocoptsService = TestBed.get(MaplocoptsService);
    expect(service).toBeTruthy();
  });
});
