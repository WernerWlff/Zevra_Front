import { CommonModule } from '@angular/common';
import { Component, OnInit, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MuscleService, Muscle } from '../../services/muscle';
import { TypeService, Type } from '../../services/type';
import { ExerciceService, Exercice } from '../../services/exercice';

@Component({
  selector: 'app-front-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './front-page.html',
  styleUrl: './front-page.css',
})
export class FrontPage implements OnInit {
  muscles = signal<Muscle[]>([]);
  types = signal<Type[]>([]);
  exercices = signal<Exercice[]>([]);
  filteredExercices = signal<Exercice[]>([]);

  selectedMuscleId: number | null = null;
  selectedTypeId: number | null = null;

  resultMessage = '';

  constructor(
    private muscleService: MuscleService,
    private typeService: TypeService,
    private exerciceService: ExerciceService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadMuscles();
    this.loadTypes();
    this.loadExercices();
  }

  private loadMuscles(): void {
    this.muscleService.getAllMuscles().subscribe({
      next: (list) => this.muscles.set(list),
      error: () => this.muscles.set([]),
    });
  }

  private loadTypes(): void {
    this.typeService.getAllTypes().subscribe({
      next: (list) => this.types.set(list),
      error: () => this.types.set([]),
    });
  }

  private loadExercices(): void {
    this.exerciceService.getAllExercices().subscribe({
      next: (list) => {
        this.exercices.set(list);
        this.applyFilters();
      },
      error: () => {
        this.exercices.set([]);
        this.filteredExercices.set([]);
        this.updateResultMessage();
      },
    });
  }

  private applyFilters(): void {
    const list = this.exercices();
    const byMuscle = this.selectedMuscleId != null
      ? list.filter((e) => e.muscle?.id === this.selectedMuscleId)
      : list;
    const byType = this.selectedTypeId != null
      ? byMuscle.filter((e) => e.type?.id === this.selectedTypeId)
      : byMuscle;
    this.filteredExercices.set(byType);
    this.updateResultMessage();
  }

  private updateResultMessage(): void {
    const n = this.filteredExercices().length;
    this.resultMessage = n === 0
      ? 'Aucun exercice trouvé'
      : `${n} exercice${n > 1 ? 's' : ''} trouv${n > 1 ? 's' : ''}.`;
  }

  onSearch(): void {
    this.applyFilters();
    // todo : redirect user to the exercice page 
  }

  onResetFilters(): void {
    this.selectedMuscleId = null;
    this.selectedTypeId = null;
    this.applyFilters();
  }
}
