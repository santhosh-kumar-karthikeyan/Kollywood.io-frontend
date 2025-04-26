import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { MatchupComponent } from './matchup/matchup.component';

const routes: Routes = [
  { path: "", component: HomeComponent},
  { path: "login" , component: LoginComponent},
  { path: "signup" , component : SignupComponent},
  { path: "game/:roomCode", component: MatchupComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
