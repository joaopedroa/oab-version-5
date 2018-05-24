import { TestBed, inject } from '@angular/core/testing';

import { XlsxToJsonServiceService } from './xlsx-to-json-service.service';

describe('XlsxToJsonServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XlsxToJsonServiceService]
    });
  });

  it('should be created', inject([XlsxToJsonServiceService], (service: XlsxToJsonServiceService) => {
    expect(service).toBeTruthy();
  }));
});
