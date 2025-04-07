import { TestBed } from '@angular/core/testing';

import { ClientslogsService } from './clientslogs.service';

describe('ClientslogsService', () => {
  let service: ClientslogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientslogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
