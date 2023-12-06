import { TestBed } from '@angular/core/testing';

import { IndentsService } from './indents.service';

describe('IndentsService', () => {
  let service: IndentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
