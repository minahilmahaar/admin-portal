import { TestBed } from '@angular/core/testing';

import { QueryscreenService } from './queryscreen.service';

describe('QueryscreenService', () => {
  let service: QueryscreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueryscreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
