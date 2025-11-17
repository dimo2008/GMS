import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  TeamMembers: object[] = [];

  constructor() {}

  GetMembers(phone: string): object[] {
    this.TeamMembers = [
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
    if (phone === '') {
      return this.TeamMembers;
    }
    this.TeamMembers = this.TeamMembers.filter((member: any) => member.phone.includes(phone));
    return this.TeamMembers;
  }
}
