import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../../Admin/Modules/users/users.service';

@Component({
  selector: 'app-profile-details',
  standalone: false,

  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.css'
})
export class ProfileDetailsComponent implements OnInit {
  user: any;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    const currentUserId = 1;
    
    this.usersService.getUserById(currentUserId).subscribe((user) => {
      this.user = user;
    });
  }

}