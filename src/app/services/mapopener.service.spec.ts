import { TestBed } from '@angular/core/testing';

import { MapopenerService } from './mapopener.service';

describe('MapopenerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapopenerService = TestBed.get(MapopenerService);
    expect(service).toBeTruthy();
  });
});
