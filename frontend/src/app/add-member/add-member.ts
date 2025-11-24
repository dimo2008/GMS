import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { MemberService } from '../Services/member-service';

@Component({
  selector: 'app-add-member',
  standalone: false,
  templateUrl: './add-member.html',
  styleUrl: './add-member.css',
})
export class AddMember implements OnInit {
  constructor(private memberService: MemberService) {}

  id: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  membershipType: string = '';
  startDate: string = '';
  endDate: Date = new Date();
  status: string = '';

  ngOnInit(): void {}

  onAddMember(): void {
    const memberData = {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      membershipType: this.membershipType,
      startDate: this.startDate,
      endDate: this.endDate,
      status: this.status,
    };

    this.memberService.AddNewMember(memberData);
  }
}
