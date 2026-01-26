import { TestBed } from '@angular/core/testing';
import { ErrorDisplayService } from './error-display.service';

describe('ErrorDisplayService', () => {
  let service: ErrorDisplayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorDisplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
