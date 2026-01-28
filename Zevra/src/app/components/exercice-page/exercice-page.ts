import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MuscleService, Muscle } from '../../services/muscle';
import { TypeService, Type } from '../../services/type';
import { ExerciceService, Exercice } from '../../services/exercice';
import { AuthService } from '../../services/auth';
import { FavoriteService, AddExerciceToFavoriteRequest } from '../../services/favorite';

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
    private route: ActivatedRoute,
    private muscleService: MuscleService,
    private typeService: TypeService,
    private exerciceService: ExerciceService,
    private authService: AuthService,
    private favoriteService: FavoriteService,
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.getToken() != null;
  }
  
  favoriteMessage = '';
  favoriteError = '';
  addingFavoriteId: number | null = null;
  removingFavoriteId: number | null = null;
  favoriteExerciceIds = signal<Set<number>>(new Set());

  loadingExercices = signal(true);

  ngOnInit(): void {
    const q = this.route.snapshot.queryParams;
    const muscleId = q['muscleId'];
    const typeId = q['typeId'];
    if (muscleId != null && muscleId !== '') {
      const n = Number(muscleId);
      if (!isNaN(n)) this.selectedMuscleId = n;
    }
    if (typeId != null && typeId !== '') {
      const n = Number(typeId);
      if (!isNaN(n)) this.selectedTypeId = n;
    }
    this.loadMuscles();
    this.loadTypes();
    this.loadExercices();
    if (this.isLoggedIn) {
      this.loadFavoriteIds();
    }
  }

  isFavorite(exerciceId: number): boolean {
    return this.favoriteExerciceIds().has(exerciceId);
  }

  private loadFavoriteIds(): void {
    const user = this.authService.getUser();
    if (!user?.id) return;
    this.favoriteService.getFavoritesByUser(user.id).subscribe({
      next: (list) => {
        const ids = new Set(list.map((f) => f.exerciceId));
        this.favoriteExerciceIds.set(ids);
      },
      error: () => this.favoriteExerciceIds.set(new Set()),
    });
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
    this.loadingExercices.set(true);
    this.exerciceService.getAllExercices().subscribe({
      next: (list) => {
        this.exercices.set(list);
        this.applyFilters();
        this.loadingExercices.set(false);
      },
      error: () => {
        this.exercices.set([]);
        this.filteredExercices.set([]);
        this.updateResultMessage();
        this.loadingExercices.set(false);
      },
    });
  }

  private getExerciceLabel(exercice: Exercice): string {
    if (exercice.name?.trim()) {
      return exercice.name.trim().toLowerCase();
    }
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
      : `${n} exercice${n > 1 ? 's' : ''} trouvé${n > 1 ? 's' : ''}.`;
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

  addToFavorites(exercice: Exercice): void {
    this.favoriteMessage = '';
    this.favoriteError = '';
    const user = this.authService.getUser();
    if (!user?.id) {
      this.favoriteError = 'Connectez-vous pour ajouter des favoris.';
      return;
    }
    this.addingFavoriteId = exercice.id;
    const name = exercice.name?.trim() || `${exercice.type?.category ?? ''} - ${exercice.muscle?.muscleTargeted ?? ''}`.trim();
    const request: AddExerciceToFavoriteRequest = {
      exercice_id: exercice.id,
      name,
      description: '',
    };
    this.favoriteService.addExerciceToFavorite(user.id, request).subscribe({
      next: () => {
        this.addingFavoriteId = null;
        this.favoriteExerciceIds.update((set) => new Set([...set, exercice.id]));
        this.favoriteMessage = 'Ajouté aux favoris.';
        setTimeout(() => (this.favoriteMessage = ''), 3000);
      },
      error: (err) => {
        this.addingFavoriteId = null;
        this.favoriteError = err.error?.message ?? err.error ?? 'Erreur lors de l\'ajout aux favoris.';
        setTimeout(() => (this.favoriteError = ''), 4000);
      },
    });
  }

  removeFromFavorites(exercice: Exercice): void {
    this.favoriteMessage = '';
    this.favoriteError = '';
    const user = this.authService.getUser();
    if (!user?.id) return;
    this.removingFavoriteId = exercice.id;
    this.favoriteService.removeExerciceFromFavorite(user.id, exercice.id).subscribe({
      next: () => {
        this.removingFavoriteId = null;
        this.favoriteExerciceIds.update((set) => {
          const next = new Set(set);
          next.delete(exercice.id);
          return next;
        });
        this.favoriteMessage = 'Retiré des favoris.';
        setTimeout(() => (this.favoriteMessage = ''), 3000);
      },
      error: (err) => {
        this.removingFavoriteId = null;
        this.favoriteError = err.error?.message ?? err.error ?? 'Erreur lors du retrait.';
        setTimeout(() => (this.favoriteError = ''), 4000);
      },
    });
  }
}
