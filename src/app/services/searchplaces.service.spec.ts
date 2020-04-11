import { TestBed } from '@angular/core/testing';

import { SearchplacesService } from './searchplaces.service';

describe('SearchplacesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchplacesService = TestBed.get(SearchplacesService);
    expect(service).toBeTruthy();
  });
});
