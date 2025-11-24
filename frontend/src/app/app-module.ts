import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Member } from './member/member';
import { Team } from './team/team';
import { Sidebar } from './sidebar/sidebar';
import { Dashboard } from './dashboard/dashboard';
import { About } from './about/about';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AddMember } from './add-member/add-member';
@NgModule({
  declarations: [App, Member, Team, Sidebar, Dashboard, About, AddMember],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [provideBrowserGlobalErrorListeners(), provideClientHydration(withEventReplay())],
  bootstrap: [App],
})
export class AppModule {}
