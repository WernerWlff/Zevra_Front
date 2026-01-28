import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpdateUserRequest } from '../../services/user';

@Component({
  selector: 'app-profile-page-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-page-edit-modal.html',
  styleUrl: './profile-page-edit-modal.css',
  inputs: ['user', 'apiError', 'saving'],
})
export class ProfilePageEditModal implements OnInit {
  user: { firstname: string; lastname: string; username: string; email: string } = {
    firstname: '',
    lastname: '',
    username: '',
    email: '',
  };

  apiError = '';

  saving = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() save = new EventEmitter<UpdateUserRequest>();

  firstName = '';
  lastName = '';
  username = '';
  email = '';

  errorMessage = '';

  ngOnInit(): void {
    this.firstName = this.user.firstname ?? '';
    this.lastName = this.user.lastname ?? '';
    this.username = this.user.username ?? '';
    this.email = this.user.email ?? '';
    this.errorMessage = '';
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('profile-edit-modal-overlay')) {
      this.closeModal.emit();
    }
  }

  onCancel(): void {
    this.closeModal.emit();
  }

  onSubmit(): void {
    this.errorMessage = '';
    const fn = (this.firstName ?? '').trim();
    const ln = (this.lastName ?? '').trim();
    const un = (this.username ?? '').trim();
    const em = (this.email ?? '').trim();
    if (!fn || !ln) {
      this.errorMessage = 'Prénom et nom sont obligatoires.';
      return;
    }
    if (un.length < 4 || un.length > 20) {
      this.errorMessage = 'Le nom d\'utilisateur doit être entre 4 et 20 caractères.';
      return;
    }
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      this.errorMessage = 'Veuillez saisir un email valide.';
      return;
    }
    this.save.emit({
      firstName: fn,
      lastName: ln,
      username: un,
      email: em,
    });
  }
}
