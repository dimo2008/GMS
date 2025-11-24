import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  TeamMembers: object[] = [];

  constructor(private http: HttpClient) {}

  GetMembers(id: string): Observable<object[]> {
    return this.http.get<object[]>('http://localhost:3000/api/members', { params: { id } });
  }
}
