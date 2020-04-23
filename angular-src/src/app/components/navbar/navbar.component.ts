import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user: Boolean = false;
  userInfo: any;
  admin: Boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getUserProfile();
  }

  logoutClicked() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.getUserProfile();
    return false;
  }

  getUserProfile() {
    this.authService.getUserProfile().subscribe(profile => {
      if (profile.success) {
        this.admin = profile.user.admin;
        this.userInfo = profile.user;
        this.user = true;
      }
      else {
        this.user = false;
      }
    });
  }

}
