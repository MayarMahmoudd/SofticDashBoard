import { TestBed } from '@angular/core/testing';

import { EmployeeRequestsService } from './employee-requests.service';

describe('EmployeeRequestsService', () => {
  let service: EmployeeRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
