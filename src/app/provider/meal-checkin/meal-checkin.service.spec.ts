import { TestBed } from '@angular/core/testing';

import { MealCheckinService } from './meal-checkin.service';

describe('MealCheckinService', () => {
  let service: MealCheckinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MealCheckinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
