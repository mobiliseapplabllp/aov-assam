import { TestBed } from '@angular/core/testing';

import { MyAssetGetService } from './my-asset-get.service';

describe('MyAssetGetService', () => {
  let service: MyAssetGetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyAssetGetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
