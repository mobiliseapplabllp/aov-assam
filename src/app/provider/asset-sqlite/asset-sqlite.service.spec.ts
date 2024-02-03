import { TestBed } from '@angular/core/testing';

import { AssetSqliteService } from './asset-sqlite.service';

describe('AssetSqliteService', () => {
  let service: AssetSqliteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetSqliteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
