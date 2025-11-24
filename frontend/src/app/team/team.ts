import { Component, OnInit } from '@angular/core';
import { MemberService } from '../Services/member-service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-team',
  standalone: false,
  templateUrl: './team.html',
  styleUrls: ['./team.css'],
})
export class Team implements OnInit {
  constructor(private memberService: MemberService) {}

  teamMembers: Observable<object[]> = new Observable<object[]>();
  totalSalaries: number = 0;
  id: string = '';


  ngOnInit(): void {
    this.teamMembers = this.memberService.GetMembers('');
  }

  onSearch(): void {
    this.teamMembers = this.memberService.GetMembers(this.id);
  }
}
