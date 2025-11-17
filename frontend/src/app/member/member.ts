import { Component, EventEmitter, Input, OnInit, Output, output } from '@angular/core';

@Component({
  selector: 'app-member',
  standalone: false,
  templateUrl: './member.html',
  styleUrl: './member.css',
})
export class Member implements OnInit {
  @Input() member: any;
  @Output() onSalaryChange = new EventEmitter();

  name: string = '';
  phone: string = '';
  email: string = '';
  address: string = '';
  hobbies: string[] = [];
  gender: string = '';
  salary: number = 0;

  constructor() {}

  ngOnInit(): void {}

  AddSalary(member: Member): void {
    member.salary += 1;
  }
  subtractSalary(member: Member): void {
    member.salary -= 1;
  }
}
