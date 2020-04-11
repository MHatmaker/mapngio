import { TestBed } from '@angular/core/testing';

import { MapinstanceService } from './mapinstance.service';

describe('MapinstanceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapinstanceService = TestBed.get(MapinstanceService);
    expect(service).toBeTruthy();
  });
});
