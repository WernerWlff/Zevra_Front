import { TestBed } from '@angular/core/testing';

import { TrainingList } from './training-list';

describe('TrainingList', () => {
  let service: TrainingList;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingList);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
