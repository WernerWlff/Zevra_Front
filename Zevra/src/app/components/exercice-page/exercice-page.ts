import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MuscleService, Muscle } from '../../services/muscle';
import { TypeService, Type } from '../../services/type';
import { ExerciceService, Exercice } from '../../services/exercice';

@Component({
  selector: 'app-exercice-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './exercice-page.html',
  styleUrl: './exercice-page.css',
})
export class ExercicesPage implements OnInit {
  muscles = signal<Muscle[]>([]);
  types = signal<Type[]>([]);
  exercices = signal<Exercice[]>([]);
  filteredExercices = signal<Exercice[]>([]);

  selectedMuscleId: number | null = null;
  selectedTypeId: number | null = null;
  searchQuery = '';
  resultMessage = '';

  constructor(
    private muscleService: MuscleService,
    private typeService: TypeService,
    private exerciceService: ExerciceService,
  ) { }

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

  private getExerciceLabel(exercice: Exercice): string {
    const typeName = exercice.type?.category ?? '';
    const muscleName = exercice.muscle?.muscleTargeted ?? '';
    return `${typeName} ${muscleName}`.trim().toLowerCase();
  }

  private applyFilters(): void {
    let list = this.exercices();

    if (this.selectedMuscleId != null) {
      list = list.filter((e) => e.muscle?.id === this.selectedMuscleId);
    }
    if (this.selectedTypeId != null) {
      list = list.filter((e) => e.type?.id === this.selectedTypeId);
    }

    const query = (this.searchQuery ?? '').trim().toLowerCase();
    if (query) {
      list = list.filter((e) => this.getExerciceLabel(e).includes(query));
    }

    this.filteredExercices.set(list);
    this.updateResultMessage();
  }

  private updateResultMessage(): void {
    const n = this.filteredExercices().length;
    this.resultMessage = n === 0
      ? 'Aucun exercice trouvé.'
      : `${n} exercices${n > 1 ? 's' : ''} trouvé${n > 1 ? 's' : ''}.`;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onResetFilters(): void {
    this.selectedMuscleId = null;
    this.selectedTypeId = null;
    this.searchQuery = '';
    this.applyFilters();
  }

  formatDuration(seconds: string | undefined): string {
    if (!seconds) {
      return ('-');
    }
    const sec = parseInt(seconds, 10);
    if (isNaN(sec)) {
      return ("-");
    }
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return s > 0 ? `${m} min ${s} s` : `${m} min`;

  }
}
