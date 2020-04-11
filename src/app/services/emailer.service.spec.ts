import { TestBed } from '@angular/core/testing';

import { EmailerService } from './emailer.service';

describe('EmailerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmailerService = TestBed.get(EmailerService);
    expect(service).toBeTruthy();
  });
});
