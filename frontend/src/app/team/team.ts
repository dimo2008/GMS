import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-team',
  standalone: false,
  templateUrl: './team.html',
  styleUrl: './team.css',
})
export class Team implements OnInit {
  teamMembers: object[] = [];
  totalSalaries: number = 0;
  ngOnInit(): void {
    this.teamMembers = [
      {
        name: 'Ahmed Magdy',
        phone: '01012345678',
        email: 'ahmad@gmail.com',
        address: 'Cairo, Egypt',
        hobbies: ['Reading', 'Traveling', 'Coding'],
        gender: 'Male',
        salary: 30,
      },
      {
        name: 'Sara Ali',
        phone: '01087654321',
        email: 'sara@gmail.com',
        address: 'Alexandria, Egypt',
        hobbies: ['Painting', 'Cooking', 'Dancing'],
        gender: 'Female',
        salary: 28,
      },
      {
        name: 'Mona Ashraf',
        phone: '01010111118',
        email: 'ahmad@gmail.com',
        address: 'Cairo, Egypt',
        hobbies: ['Reading', 'Traveling', 'Coding'],
        gender: 'Male',
        salary: 35,
      },
    ];
  }

  onSalaryChange(member: any): void {
    this.totalSalaries += member.salary;
  }
}
