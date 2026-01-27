import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercicePage } from './exercice-page';

describe('ExercicePage', () => {
  let component: ExercicePage;
  let fixture: ComponentFixture<ExercicePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExercicePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExercicePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
