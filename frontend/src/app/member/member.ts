import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-member',
  standalone: false,
  templateUrl: './member.html',
  styleUrl: './member.css',
})
export class Member implements OnInit {
   @Input() member: any;
  name: string = '';
  phone: string = '';
  email: string = '';
  address: string = '';
  hobbies: string[] = [];
  gender: string = '';

  constructor() {}

  ngOnInit(): void {

  }
}
