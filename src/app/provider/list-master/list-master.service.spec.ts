import { TestBed } from '@angular/core/testing';

import { ListMasterService } from './list-master.service';

describe('ListMasterService', () => {
  let service: ListMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
