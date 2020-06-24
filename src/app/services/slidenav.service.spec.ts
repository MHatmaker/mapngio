import { TestBed } from '@angular/core/testing';

import { SlidenavService } from './slidenav.service';

describe('SlidenavService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SlidenavService = TestBed.get(SlidenavService);
    expect(service).toBeTruthy();
  });
});
