import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { About } from './about/about';
import { Dashboard } from './dashboard/dashboard';
import { Team } from './team/team';
const routes: Routes = [
  { path: 'about', component: About },
  { path: 'team', component: Team },
  { path: '', component: Dashboard },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
