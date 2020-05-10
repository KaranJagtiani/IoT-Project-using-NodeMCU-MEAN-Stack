import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ChatService } from "src/app/services/chat-service/chat.service";
import { AuthService } from "src/app/services/auth-service/auth.service";

@Component({
  selector: "app-mqtt",
  templateUrl: "./mqtt.component.html",
  styleUrls: ["./mqtt.component.scss"],
})
export class MqttComponent implements OnInit {
  topicname: any;
  msg: any;
  isConnected: boolean = false;
  socketMsg: string;

  numAppliances: Number = 3;
  AppInfo: any[] = [];

  deviceConnected: boolean = false;

  @ViewChild("msglog", { static: true }) msglog: ElementRef;

  constructor(private authService: AuthService, private chat: ChatService) {}

  ngOnInit() {
    this.refreshAppList();
    this.chat.messages.subscribe((msg) => {
      if (msg.topic === "device-connected") {
        this.deviceConnected = msg.data;
      }
      if (msg.topic === "from-device") {
        let deviceNumber = parseInt(msg.data[0]) - 1;
        let deviceStatus = msg.data[1];
        this.AppInfo[deviceNumber].appOn = deviceStatus === "N";
        this.AppInfo[deviceNumber].appOff = deviceStatus === "F";
      }
      if (msg.data === "Connected.") {
        this.deviceConnected = true;
      }
    });
  }

  refreshAppList() {
    let query = {};
    this.AppInfo = [];
    this.authService.getAppInfo(query).subscribe((profile) => {
      for (var i = 0; i < profile.user.length; i += 1) {
        this.AppInfo.push(profile.user[i]);
        if (this.AppInfo[i].timeStarted)
          this.AppInfo[i].timeStarted = this.formatDate(
            new Date(this.AppInfo[i].timeStarted)
          );
        if (this.AppInfo[i].timeEnded)
          this.AppInfo[i].timeEnded = this.formatDate(
            new Date(this.AppInfo[i].timeEnded)
          );
      }
    });
  }

  inter(applianceNumber) {
    let appliance: any = {
      name: "Appliance One",
    };
    let final_str = "";
    const p1 = new Promise((resolve, reject) => {
      if (
        !this.AppInfo[applianceNumber].appOn &&
        this.AppInfo[applianceNumber].appOff
      ) {
        if (applianceNumber == 0) {
          final_str = "OneOn";
        }
        if (applianceNumber == 1) {
          appliance.name = "Appliance Two";
          final_str = "TwoOn";
        }
        if (applianceNumber == 2) {
          appliance.name = "Appliance Three";
          final_str = "ThreeOn";
        }

        this.authService.appOn(appliance).subscribe((profile) => {
          if (profile.success) {
            this.chat.sendMsg(final_str);
            resolve(1);
          }
        });
      } else {
        if (applianceNumber == 0) {
          appliance.name = "Appliance One";
          final_str = "OneOff";
        }
        if (applianceNumber == 1) {
          appliance.name = "Appliance Two";
          final_str = "TwoOff";
        }
        if (applianceNumber == 2) {
          appliance.name = "Appliance Three";
          final_str = "ThreeOff";
        }
        this.authService.appOff(appliance).subscribe((profile) => {
          if (profile.success) {
            this.chat.sendMsg(final_str);
            resolve(1);
          }
        });
      }
    });
    return p1;
  }

  async sendMessage(applianceNumber) {
    await this.inter(applianceNumber).then((data) => {
      // if (data) this.refreshAppList();
    });
  }

  formatDate(date) {
    var monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var hour = date.getHours();
    var min = date.getMinutes();
    var timeOfDay = "PM";
    if (hour < 12) {
      timeOfDay = "AM";
    }
    if (hour > 12) {
      hour -= 12;
      if (hour == 12) {
        timeOfDay = "AM";
      }
    }
    if (hour == 0) {
      hour = 12;
    }
    if (hour < 10) {
      hour = "0" + String(hour);
    }
    if (min < 10) {
      min = "0" + String(min);
    }
    return (
      this.suffixNumber(day) +
      " " +
      monthNames[monthIndex] +
      ", " +
      year +
      ",  " +
      hour +
      ":" +
      min +
      timeOfDay
    );
  }

  suffixNumber(i) {
    var j = i % 10,
      k = i % 100;
    if (j == 1 && k != 11) {
      return i + "st";
    }
    if (j == 2 && k != 12) {
      return i + "nd";
    }
    if (j == 3 && k != 13) {
      return i + "rd";
    }
    return i + "th";
  }

  logMsg(message): void {
    this.msglog.nativeElement.innerHTML += "<br><hr>" + message;
  }

  clear(): void {
    this.msglog.nativeElement.innerHTML = "";
  }
}
