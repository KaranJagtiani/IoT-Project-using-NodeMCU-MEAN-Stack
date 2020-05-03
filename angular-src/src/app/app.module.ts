import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatDialogModule,
  MatButtonModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatIconModule,
  MatProgressBarModule
} from '@angular/material';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FlashMessagesModule } from 'angular2-flash-messages';


// Components
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';
import { MqttComponent } from './components/mqtt/mqtt.component';
// Components ----

// Services
import { SocketService } from './services/socket/socket.service'
import { ChatService } from './services/chat-service/chat.service';
import { AuthService } from './services/auth-service/auth.service';
import { LoaderService } from './services/loader-service/loader.service';
import { LoaderInterceptor } from './services/loader-service/loaderInterceptor.interceptor';
// Services ----

// Guards
import { AuthGuard as ProfileGuard } from './guards/auth.guard';
import { LoggedInGuard as LoginGuard } from './guards/logged-in.guard';
// Guards ----
const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
  { path: 'register', component: RegisterComponent, canActivate: [LoginGuard]},
  { path: 'thank_you', component: ThankYouComponent, canActivate: [LoginGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [ProfileGuard] },
  { path: 'appliances', component: MqttComponent, canActivate: [ProfileGuard] },

  { path: '**', redirectTo: 'appliances' },
];

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    ProfileComponent,
    LoginComponent,
    NavbarComponent,
    LoaderComponent,
    ThankYouComponent,
    MqttComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatIconModule,
    MatProgressBarModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    MDBBootstrapModule.forRoot(),
    AngularFontAwesomeModule,
    FlashMessagesModule.forRoot()
  ],
  exports: [RouterModule],
  providers: [SocketService, AuthService, LoaderService, ChatService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
