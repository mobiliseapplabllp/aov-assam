import { TestBed } from '@angular/core/testing';

import { DigitalChecklistService } from './digital-checklist.service';

describe('DigitalChecklistService', () => {
  let service: DigitalChecklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DigitalChecklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
