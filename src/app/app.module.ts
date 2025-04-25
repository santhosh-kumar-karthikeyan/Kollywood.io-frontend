import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NavListItemsComponent } from './nav-list-items/nav-list-items.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JWTInterceptorService } from './services/Interceptors/jwtinterceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    NavListItemsComponent,
    ProfileComponent,
    LoginComponent,
    HomeComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
