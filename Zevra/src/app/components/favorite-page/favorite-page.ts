import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { FavoriteService, FavoriteResponse } from '../../services/favorite';


@Component({
  selector: 'app-favorite-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './favorite-page.html',
  styleUrl: './favorite-page.css',
})
export class FavoritePage implements OnInit {
  favorites = signal<FavoriteResponse[]>([]);
  loading = signal(true);
  removingId: number | null = null;
  message = '';
  error = '';

  constructor(
    private authService: AuthService,
    private favoriteService: FavoriteService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (!user?.id || !this.authService.getToken()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadFavorites(user.id);
  }

  private loadFavorites(userId: string): void {
    this.loading.set(true);
    this.favoriteService.getFavoritesByUser(userId).subscribe({
      next: (list) => {
        this.favorites.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.favorites.set([]);
        this.loading.set(false);
        this.error = 'Impossible de charger les favoris.';
      },
    });
  }

  removeFavorite(fav: FavoriteResponse): void {
    const user = this.authService.getUser();
    if (!user?.id) {
      return;
    }
    this.message = '';
    this.error = '';
    this.removingId = fav.id;
    this.favoriteService.removeExerciceFromFavorite(user.id, fav.exerciceId).subscribe({
      next: () => {
        this.removingId = null;
        this.favorites.update((list) => list.filter((f) => f.id !== fav.id));
        this.message = 'Retiré des favoris';
        setTimeout(() => (this.message = ''),3000);
      },
      error: () => {
        this.removingId = null;
        this.error = 'Erreur lors du retrait.';
        setTimeout(() => (this.error = ''), 4000);
      },
    });
  }
}
