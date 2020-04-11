import { TestBed } from '@angular/core/testing';

import { EsrimapService } from './esrimap.service';

describe('EsrimapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EsrimapService = TestBed.get(EsrimapService);
    expect(service).toBeTruthy();
  });
});
