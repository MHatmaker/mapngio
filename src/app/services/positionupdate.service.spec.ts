import { TestBed } from '@angular/core/testing';

import { PositionupdateService } from './positionupdate.service';

describe('PositionupdateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PositionupdateService = TestBed.get(PositionupdateService);
    expect(service).toBeTruthy();
  });
});
