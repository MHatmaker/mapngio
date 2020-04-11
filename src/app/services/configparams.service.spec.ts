import { TestBed } from '@angular/core/testing';

import { ConfigparamsService } from './configparams.service';

describe('ConfigparamsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfigparamsService = TestBed.get(ConfigparamsService);
    expect(service).toBeTruthy();
  });
});
