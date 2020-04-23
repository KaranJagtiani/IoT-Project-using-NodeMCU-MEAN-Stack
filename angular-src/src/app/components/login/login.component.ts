import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: String;
  password: String;
  invalidUsername: Boolean = true;
  invalidPassword: Boolean = true;
  invalidCred: Boolean = false;
  formEmpty: Boolean = false;
  response: String;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    let user = {
      username: this.username,
      password: this.password
    }
    if(!user.username || !user.password){
      this.formEmpty = true;
      return;
    }
    else{
      this.formEmpty = false;
    }
    console.log(user);
    this.authService.authenticateUser(user).subscribe(profile => {
      console.log(profile);
      if (profile.success) {
        this.authService.storeUserData(profile.token, profile.user);
        this.router.navigate(['/profile']);
        location.reload();
      }
      else {
      this.response = profile.msg;
      this.invalidCred = true;
      }
    });
  }

  signUp(){
    this.router.navigate(['/register'])
  }
}
