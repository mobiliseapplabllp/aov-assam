import { TestBed } from '@angular/core/testing';

import { PmCalService } from './pm-cal.service';

describe('PmCalService', () => {
  let service: PmCalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PmCalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
