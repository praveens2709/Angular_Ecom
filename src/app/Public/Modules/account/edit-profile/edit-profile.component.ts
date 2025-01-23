import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../../../Admin/Modules/users/users.service';

@Component({
  selector: 'app-edit-profile',
  standalone: false,
  
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  profileForm!: FormGroup;
  user: any = {
    mobile: '',
    fullName: '',
    email: '',
    birthday: '',
    gender: '',
  };
  initialFormValue: any = {}; // Store the initial values

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserData();
  }

  initializeForm(): void {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthday: [''], // Optional
      gender: [''], // Optional
    });
  }

  loadUserData(): void {
    const userId = '1'; // Replace with dynamic ID if needed
    this.usersService.getUsers().subscribe((users) => {
      this.user = users.find((u) => u.id === userId) || this.user;
      this.profileForm.patchValue(this.user); // Populate form fields dynamically
      this.initialFormValue = { ...this.profileForm.value }; // Store initial values
    });
  }

  hasFormChanged(): boolean {
    const currentFormValue = this.profileForm.getRawValue();
    return JSON.stringify(currentFormValue) !== JSON.stringify(this.initialFormValue);
  }

  selectGender(gender: string): void {
    this.profileForm.get('gender')?.setValue(gender);
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.usersService.editUser(this.profileForm.value).subscribe(() => {
        alert('Profile updated successfully!');
        this.initialFormValue = { ...this.profileForm.value }; // Reset initial values
      });
    }
  }

  handleBackToProfileClick(): void {
    this.router.navigate(['account/profile']);
  }
}