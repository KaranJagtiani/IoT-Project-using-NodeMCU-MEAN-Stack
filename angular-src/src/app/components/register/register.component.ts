import { Component, OnInit, Input } from "@angular/core";
import { FormControl, Validators, FormGroup } from "@angular/forms";
import { AuthService } from "src/app/services/auth-service/auth.service";
import { Router } from "@angular/router";

function validateUsername(c: FormControl) {
  let usernameReg =
    /^(?=.{6,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
  return usernameReg.test(c.value)
    ? null
    : {
        validateUsername: {
          valid: false,
        },
      };
}

function validateEmail(c: FormControl) {
  let EMAIL_REGEXP =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return EMAIL_REGEXP.test(c.value)
    ? null
    : {
        validateEmail: {
          valid: false,
        },
      };
}
function validatePassword(c: FormControl) {
  let EMAIL_REGEXP =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return EMAIL_REGEXP.test(c.value)
    ? null
    : {
        validatePassword: {
          valid: false,
        },
      };
}

function validateName(c: FormControl) {
  let EMAIL_REGEXP = /^\b[a-zA-Z0-9_]+\b$/;
  return EMAIL_REGEXP.test(c.value)
    ? null
    : {
        validateName: {
          valid: false,
        },
      };
}

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  loginForm: FormGroup;
  hide: Boolean = true;
  hide2: Boolean = true;
  usernameTaken: Boolean = false;
  emailTaken: Boolean = false;
  passMatch: Boolean = true;
  acceptablePass: Boolean = false;
  strongPass: Boolean = false;
  weakPass: Boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      firstName: new FormControl("", [Validators.required, validateName]),
      lastName: new FormControl("", [Validators.required, validateName]),
      email: new FormControl("", [Validators.required, validateEmail]),
      mobile: new FormControl("", [Validators.required]),
      username: new FormControl("", [Validators.required, validateUsername]),
      password: new FormControl("", [Validators.required, validatePassword]),
      passwordC: new FormControl("", [Validators.required]),
    });
  }

  capitalizeStr(str) {
    if (str && typeof str === "string") {
      str = str.toLowerCase();
      str = str.split(" ");
      for (var i = 0, x = str.length; i < x; i++) {
        if (str[i]) {
          str[i] = str[i][0].toUpperCase() + str[i].substr(1);
        }
      }
      return str.join(" ");
    } else {
      return str;
    }
  }

  checkPassMatch() {
    if (
      this.loginForm.controls.password.value !=
      this.loginForm.controls.passwordC.value
    ) {
      this.passMatch = false;
    } else {
      this.passMatch = true;
    }
  }

  checkPass() {
    let checkWeakPass = /^[a-zA-Z0-9]{6,}$/;
    let checkAcceptablePass =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    let checkStrongPass =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;

    if (checkWeakPass.test(this.loginForm.controls.password.value)) {
      this.strongPass = false;
      this.acceptablePass = false;
      this.weakPass = true;
    } else {
      this.weakPass = false;
    }

    if (checkAcceptablePass.test(this.loginForm.controls.password.value)) {
      this.strongPass = false;
      this.acceptablePass = true;
      this.weakPass = false;
    } else {
      this.acceptablePass = false;
    }

    if (checkStrongPass.test(this.loginForm.controls.password.value)) {
      this.acceptablePass = false;
      this.weakPass = false;
      this.strongPass = true;
    } else {
      this.strongPass = false;
    }
  }

  registerNewUser() {
    if (
      this.loginForm.controls.password.value !=
      this.loginForm.controls.passwordC.value
    ) {
      this.passMatch = false;
      return;
    }
    let name: string;
    name =
      this.loginForm.controls.firstName.value +
      " " +
      this.loginForm.controls.lastName.value;

    if (!this.loginForm.invalid) {
      let user = {
        name: name,
        email: this.loginForm.controls.email.value,
        mobile: this.loginForm.controls.mobile.value,
        username: this.loginForm.controls.username.value,
        password: this.loginForm.controls.password.value,
      };
      this.authService.registerUser(user).subscribe((profile) => {
        if (profile.success) {
          this.usernameTaken = false;
          this.emailTaken = false;
          this.router.navigate(["/thank_you"]);
        } else {
          if (profile.usernameTaken) {
            this.usernameTaken = true;
            this.emailTaken = false;
          }
          if (profile.emailExists) {
            this.emailTaken = true;
            this.usernameTaken = false;
          }
        }
      });
    }
  }

  onlyNumber(event) {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  onlyLetter(event) {
    let patt = /^([A-Z]{1,1})$/;
    let result = patt.test(event.key);
    return result;
  }
}
