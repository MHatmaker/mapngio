import { TestBed } from '@angular/core/testing';

import { SharemapService } from './sharemap.service';

describe('SharemapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharemapService = TestBed.get(SharemapService);
    expect(service).toBeTruthy();
  });
});
