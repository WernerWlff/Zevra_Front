import { TestBed } from '@angular/core/testing';

import { Muscle } from './muscle';

describe('Muscle', () => {
  let service: Muscle;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Muscle);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
