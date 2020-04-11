import { TestBed } from '@angular/core/testing';

import { SlideviewService } from './slideview.service';

describe('SlideviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SlideviewService = TestBed.get(SlideviewService);
    expect(service).toBeTruthy();
  });
});
