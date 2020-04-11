import { TestBed } from '@angular/core/testing';

import { DestinationsService } from './destinations.service';

describe('DestinationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DestinationsService = TestBed.get(DestinationsService);
    expect(service).toBeTruthy();
  });
});
