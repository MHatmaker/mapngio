import { TestBed } from '@angular/core/testing';

import { PophandlerService } from './pophandler.service';

describe('PophandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PophandlerService = TestBed.get(PophandlerService);
    expect(service).toBeTruthy();
  });
});
