import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';

  isSubmitting = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.errorMessage = '';
    this.isSubmitting = true;

    this.authService.login(this.email.trim(), this.password).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.authService.setSession(res);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message ?? err.error ?? 'Erreur lors de la connexion.';
      },
    });
  }
}