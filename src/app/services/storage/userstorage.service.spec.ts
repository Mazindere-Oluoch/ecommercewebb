import { TestBed } from '@angular/core/testing';

import { UserstorageService } from './userstorage.service';

describe('UserstorageService', () => {
  let service: UserstorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserstorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
