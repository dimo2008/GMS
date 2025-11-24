import { Component, EventEmitter, Input, OnInit, Output, output } from '@angular/core';

@Component({
  selector: 'app-member',
  standalone: false,
  templateUrl: './member.html',
  styleUrl: './member.css',
})
export class Member implements OnInit {
  @Input() member: any;

  id: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  membershipType: string = '';
  startDate: string = '';
  endDate: Date = new Date();
  status: string = '';

  constructor() {}

  ngOnInit(): void {}
}
