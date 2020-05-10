import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthService } from "src/app/services/auth-service/auth.service";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  currentPassDomBool: Boolean = false;
  newPassDomBool: Boolean = false;
  passChanged: Boolean = false;
  response: String = "Password Changed";

  user: any;
  admin: Boolean = false;
  currentPass: String;
  newPass: String;
  newConfirmPass: String;

  constructor(private authService: AuthService, private matDialog: MatDialog) {}

  @ViewChild("frmCurrentPass", { static: false }) formValues;
  @ViewChild("frmConfirmPass", { static: false }) formValues2;

  ngOnInit() {
    this.authService.getUserProfile().subscribe((profile) => {
      if (profile.success) {
        this.user = profile.user;
        this.admin = profile.user.admin;
      }
    });
  }

  changePassword(changePassword) {
    if (this.matDialog.openDialogs.length == 0) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      if (window.innerWidth < 768) {
        dialogConfig.width = "95%";
        dialogConfig.height = "44%";
      } else {
        dialogConfig.width = "62%";
        dialogConfig.height = "51%";
      }

      dialogConfig.panelClass = "my-panel";
      let dialogRef = this.matDialog.open(changePassword, dialogConfig);
      dialogRef.afterClosed().subscribe((result) => {
        this.currentPassDomBool = false;
        this.newPassDomBool = false;
      });
    }
  }

  submitCurrentPassword() {
    let x: HTMLElement = document.getElementById("response");
    this.authService
      .checkCurrentPassword(this.user.username, this.currentPass)
      .subscribe((profile) => {
        this.response = profile.msg;
        if (profile.success) {
          this.currentPassDomBool = false;
          this.newPassDomBool = true;
          x.setAttribute(
            "style",
            "margin-left: 0!important; background: #3cff00"
          );
          setTimeout(() => {
            x.setAttribute("style", "margin-left: -100%; background: #3cff00");
          }, 3000);
          let swipe: HTMLElement = document.getElementById("swipe-left");
          swipe.setAttribute("style", "transform: translate(-150%)");
          let swipe2: HTMLElement = document.getElementById("swipe-right");
          swipe2.setAttribute("style", "transform: translate(0)");
        } else {
          this.currentPassDomBool = true;
          x.setAttribute(
            "style",
            "margin-left: 0!important; background: #ff2441"
          );

          setTimeout(() => {
            x.setAttribute("style", "margin-left: -100%; background: #ff2441");
          }, 3000);
        }
      });
  }

  submitNewPassword() {
    let x: HTMLElement = document.getElementById("response");
    let y: HTMLElement = document.getElementById("response2");

    this.authService
      .updatePassword(
        this.user.username,
        this.currentPass,
        this.newPass,
        this.newConfirmPass
      )
      .subscribe((profile) => {
        this.response = profile.msg;

        if (profile.success) {
          this.newPassDomBool = false;
          this.passChanged = true;
          y.setAttribute("style", "left: 0; background: #3cff00");

          setTimeout(() => {
            y.setAttribute("style", "left: -250px; background: #3cff00");
          }, 3000);

          this.matDialog.closeAll();
          this.formValues.resetForm();
          this.formValues2.resetForm();
        } else {
          this.newPassDomBool = true;
          x.setAttribute(
            "style",
            "margin-left: 0!important; background: #ff2441"
          );

          setTimeout(() => {
            x.setAttribute("style", "margin-left: -100%; background: #ff2441");
          }, 3000);
        }
      });
  }

  viewInfo(content) {
    if (this.matDialog.openDialogs.length == 0) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      if (window.innerWidth < 768) {
        dialogConfig.width = "90%";
        dialogConfig.height = "40%";
      } else {
        dialogConfig.width = "65%";
        dialogConfig.height = "49%";
      }
      dialogConfig.panelClass = "my-panel";
      let dialogRef = this.matDialog.open(content, dialogConfig);
      dialogRef.afterClosed().subscribe((result) => {});
    }
  }
}
