import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member',
  standalone: false,
  templateUrl: './member.html',
  styleUrl: './member.css',
})
export class Member implements OnInit {
  name: string = '';
  phone: string = '';
  email: string = '';
  address: string = '';
  hobbies: string[] = [];
  gender: string = '';

  constructor() {}

  ngOnInit(): void {
    this.name = 'Ahmed Magdy';
    this.phone = '01012345678';
    this.email = 'ahmad@gmail.com';
    this.address = 'Cairo, Egypt';
    this.hobbies = ['Reading', 'Traveling', 'Coding'];
    this.gender = 'Male';
  }
}
