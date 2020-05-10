import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { map } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from "src/environments/environment";

interface data {
  success: Boolean;
  msg: string;
  invalidPass: Boolean;
  categoryReq: Boolean;
  countryReq: Boolean;
  stateReq: Boolean;
  cityReq: Boolean;
  regSuccess: Boolean;
  alreadyReg: Boolean;
  usernameTaken: Boolean;
  emailExists: Boolean;
  token: String;
  user: any;
  faculty: any;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user: any;
  authTokenUser: any;

  constructor(private http: HttpClient) {}

  updatePassword(username, currentPassword, newPassword, newConfirmPassword) {
    let newUser: Object;
    newUser = {
      username: username,
      currentPassword: currentPassword,
      newPassword: newPassword,
      newConfirmPassword: newConfirmPassword,
    };
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    return this.http
      .post<data>(environment.host + "/users/update_password", newUser, {
        headers: headers,
      })
      .pipe(map((res) => res));
  }

  checkCurrentPassword(username, password) {
    let newUser: Object;

    newUser = {
      username: username,
      password: password,
    };
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    return this.http
      .post<data>(environment.host + "/users/check_current_password", newUser, {
        headers: headers,
      })
      .pipe(map((res) => res));
  }

  getUserProfile() {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this.loadToken(),
        "Content-Type": "application/json",
      }),
    };
    return this.http
      .get<data>(environment.host + "/users/profile", httpOptions)
      .pipe(map((res) => res));
  }

  getAppInfo(param) {
    return this.http
      .get<data>(environment.host + "/users/app-info", { params: param })
      .pipe(map((res) => res));
  }

  appOff(user) {
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    return this.http
      .post<data>(environment.host + "/users/appliance-off", user, {
        headers: headers,
      })
      .pipe(map((res) => res));
  }

  appOn(user) {
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    return this.http
      .post<data>(environment.host + "/users/appliance-on", user, {
        headers: headers,
      })
      .pipe(map((res) => res));
  }

  authenticateUser(user) {
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    return this.http
      .post<data>(environment.host + "/users/authenticate", user, {
        headers: headers,
      })
      .pipe(map((res) => res));
  }

  storeUserData(userToken, user) {
    localStorage.setItem("id_token", userToken);
    localStorage.setItem("user", JSON.stringify(user));
    this.authTokenUser = userToken;
    this.user = user;
  }

  loadToken() {
    const userToken = localStorage.getItem("id_token");
    return userToken;
  }

  loggedIn() {
    const helper = new JwtHelperService();
    var isExpired = helper.isTokenExpired(this.loadToken());
    return isExpired;
  }

  logout() {
    this.authTokenUser = null;
    this.user = null;
    window.localStorage.clear();
    location.reload();
  }

  registerUser(user) {
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json");
    return this.http
      .post<data>(environment.host + "/users/register", user, {
        headers: headers,
      })
      .pipe(map((res) => res));
  }
}
