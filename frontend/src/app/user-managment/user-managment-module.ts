import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from './user/user';
import { Authentication } from './authentication/authentication';



@NgModule({
  declarations: [
    User,
    Authentication
  ],
  imports: [
    CommonModule
  ]
})
export class UserManagmentModule { }
