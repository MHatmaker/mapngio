import { TestBed } from '@angular/core/testing';

import { CurrentmaptypeService } from './currentmaptype.service';

describe('CurrentmaptypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrentmaptypeService = TestBed.get(CurrentmaptypeService);
    expect(service).toBeTruthy();
  });
});
