import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { MatchupComponent } from './matchup/matchup.component';
import { canDeactivateGuard } from './guards/can-deactivate.guard';
import { GameComponent } from './game/game.component';
import { ProfileComponent } from './profile/profile.component';
import { AdminComponent } from './admin/admin.component';
import { canActivateGuard } from './guards/can-activate.guard';

const routes: Routes = [
  { path: "", component: HomeComponent},
  { path: "login" , component: LoginComponent},
  { path: "signup" , component : SignupComponent},
  { path: "matchup", component: MatchupComponent},
  { path: "game/:roomCode", component: GameComponent, canDeactivate: [canDeactivateGuard]},
  { path: "profile/:username", component: ProfileComponent, canDeactivate: [canDeactivateGuard]},
  { path: "admin" , component: AdminComponent, canActivate: [canActivateGuard], data: { roles: ['Admin']}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
