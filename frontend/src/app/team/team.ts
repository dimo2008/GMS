import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-team',
  standalone: false,
  templateUrl: './team.html',
  styleUrl: './team.css',
})
export class Team implements OnInit {
  teamMembers: object[] = [];
  ngOnInit(): void {
    this.teamMembers = [
      {
        name: 'Ahmed Magdy',
        phone: '01012345678',
        email: 'ahmad@gmail.com',
        address: 'Cairo, Egypt',
        hobbies: ['Reading', 'Traveling', 'Coding'],
        gender: 'Male',
        age: 30
      },
      {
        name: 'Sara Ali',
        phone: '01087654321',
        email: 'sara@gmail.com',
        address: 'Alexandria, Egypt',
        hobbies: ['Painting', 'Cooking', 'Dancing'],
        gender: 'Female',
        age: 28
      },
      {
        name: 'Mona Ashraf',
        phone: '01010111118',
        email: 'ahmad@gmail.com',
        address: 'Cairo, Egypt',
        hobbies: ['Reading', 'Traveling', 'Coding'],
        gender: 'Male',
        age: 35
      },
    ];
  }

  onLike(member: any): void {
    window.alert(`Liked member: ${member.name}`);
  }
}
