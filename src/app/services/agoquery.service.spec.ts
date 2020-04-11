import { TestBed } from '@angular/core/testing';

import { AgoqueryService } from './agoquery.service';

describe('AgoqueryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AgoqueryService = TestBed.get(AgoqueryService);
    expect(service).toBeTruthy();
  });
});
