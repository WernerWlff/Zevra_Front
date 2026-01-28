import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timeout, catchError, throwError } from 'rxjs';
import { AuthService } from '../../services/auth';
import { UserService, UpdateUserRequest } from '../../services/user';
import { ProfilePageEditModal } from '../profile-page-edit-modal/profile-page-edit-modal';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, ProfilePageEditModal],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage implements OnInit {
  showEditModal = false;
  profileError = '';
  profileSuccess = '';
  saving = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
  ) {}

  get user(): { id: string; firstname: string; lastname: string; username: string; email: string } | null {
    return this.authService.getUser();
  }

  ngOnInit(): void {
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  openEditModal(): void {
    this.profileError = '';
    this.profileSuccess = '';
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  onSaveProfile(request: UpdateUserRequest): void {
    const u = this.user;
    if (!u?.id) return;
    this.profileError = '';
    this.closeEditModal();
    this.saving = true;
    this.userService
      .updateUser(u.id, request)
      .pipe(
        timeout(15000),
        catchError((err) => {
          const msg = err?.error?.message ?? err?.error ?? err?.message ?? 'Erreur lors de la mise à jour du profil.';
          this.profileError = typeof msg === 'string' ? msg : 'Erreur lors de la mise à jour du profil.';
          setTimeout(() => (this.profileError = ''), 5000);
          return throwError(() => err);
        }),
      )
      .subscribe({
        next: (updated) => {
          this.saving = false;
          this.profileError = '';
          if (updated != null) {
            const res = updated as { firstname?: string; lastname?: string; username?: string; email?: string; firstName?: string; lastName?: string };
            this.authService.updateStoredUser({
              firstname: res.firstname ?? res.firstName ?? request.firstName ?? '',
              lastname: res.lastname ?? res.lastName ?? request.lastName ?? '',
              username: res.username ?? request.username ?? '',
              email: res.email ?? request.email ?? '',
            });
          } else {
            this.authService.updateStoredUser({
              firstname: request.firstName ?? '',
              lastname: request.lastName ?? '',
              username: request.username ?? '',
              email: request.email ?? '',
            });
          }
          this.profileSuccess = 'Profil mis à jour.';
          setTimeout(() => (this.profileSuccess = ''), 3000);
        },
        error: () => {
          this.saving = false;
        },
      });
  }
}
