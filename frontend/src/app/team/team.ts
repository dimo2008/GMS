import { Component, OnInit } from '@angular/core';
import { MemberService } from '../Services/member-service';

@Component({
  selector: 'app-team',
  standalone: false,
  templateUrl: './team.html',
  styleUrls: ['./team.css'],
})
export class Team implements OnInit {
  constructor(private memberService: MemberService) {}

  teamMembers: object[] = [];
  totalSalaries: number = 0;
  phone: string = '';


  ngOnInit(): void {
    this.teamMembers = this.memberService.GetMembers('');
  }

  onSalaryChange(member: any): void {
    this.totalSalaries += member.salary;
  }

  onSearch(): void {
    this.teamMembers = this.memberService.GetMembers(this.phone);
  }
}
