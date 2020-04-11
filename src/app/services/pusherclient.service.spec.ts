import { TestBed } from '@angular/core/testing';

import { PusherclientService } from './pusherclient.service';

describe('PusherclientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PusherclientService = TestBed.get(PusherclientService);
    expect(service).toBeTruthy();
  });
});
