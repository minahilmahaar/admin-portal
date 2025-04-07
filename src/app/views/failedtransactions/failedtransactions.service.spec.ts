import { TestBed } from '@angular/core/testing';

import { FailedtransactionsService } from './failedtransactions.service';

describe('FailedtransactionsService', () => {
  let service: FailedtransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FailedtransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
