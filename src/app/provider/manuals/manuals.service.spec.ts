import { TestBed } from '@angular/core/testing';

import { ManualsService } from './manuals.service';

describe('ManualsService', () => {
  let service: ManualsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManualsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
