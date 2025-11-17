import { Component, EventEmitter, Input, OnInit, Output, output } from '@angular/core';

@Component({
  selector: 'app-member',
  standalone: false,
  templateUrl: './member.html',
  styleUrl: './member.css',
})
export class Member implements OnInit {
  @Input() member: any;
  @Output() like = new EventEmitter();

  name: string = '';
  phone: string = '';
  email: string = '';
  address: string = '';
  hobbies: string[] = [];
  gender: string = '';
  age: number = 0;

  constructor() {}

  ngOnInit(): void {}

  AddAge(member: Member): void {
    member.age += 1;
  }
  subtractAge(member: Member): void {
    member.age -= 1;
  }
}
