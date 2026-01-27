import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService, RegisterRequest } from '../../services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  firstname = '';
  lastname = '';
  username = '';
  email = '';
  password = '';

  isSubmitting = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.errorMessage = '';
    this.isSubmitting = true;

    const data: RegisterRequest = {
      firstname: this.firstname.trim(),
      lastname: this.lastname.trim(),
      username: this.username.trim(),
      email: this.email.trim(),
      password: this.password
    };

    this.authService.register(data).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message ?? err.error ?? 'erreur lors de l\'inscription.';
      },
    });
  }
}
