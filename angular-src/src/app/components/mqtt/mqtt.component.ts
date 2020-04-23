import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/services/chat-service/chat.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-mqtt',
  templateUrl: './mqtt.component.html',
  styleUrls: ['./mqtt.component.scss']
})
export class MqttComponent implements OnInit {

  private subscription: Subscription;
  topicname: any;
  msg: any;
  isConnected: boolean = false;
  socketMsg: string;

  leds = [false];
  Appliances: any[] = [
    { name: "Appliance One", value: false },
    { name: "Appliance Two", value: false },
    { name: "Appliance Three", value: false },
  ];
  numAppliances: Number = 3;
  AppInfo: any[] = [];

  @ViewChild('msglog', { static: true }) msglog: ElementRef;

  constructor(
    private authService: AuthService,
    private chat: ChatService
  ) { }

  ngOnInit() {
    this.refreshAppList();
    this.chat.messages.subscribe(msg => {
      console.log("Socekt: " + msg);
    });
  }

  refreshAppList() {
    let query = {};
    this.AppInfo = [];
    this.authService.getAppInfo(query).subscribe(profile => {
      for (var i = 0; i < profile.user.length; i += 1) {
        this.AppInfo.push(profile.user[i]);
        if (this.AppInfo[i].timeStarted)
          this.AppInfo[i].timeStarted = this.formatDate(new Date(this.AppInfo[i].timeStarted));
        if (this.AppInfo[i].timeEnded)
          this.AppInfo[i].timeEnded = this.formatDate(new Date(this.AppInfo[i].timeEnded));
      }
      console.log(profile);
    });
  }

  inter(applianceNumber) {
    let user: any = {
      name: "Appliance One"
    }
    let final_str = "";
    const p1 = new Promise((resolve, reject) => {
      if (!this.AppInfo[applianceNumber].appOn && this.AppInfo[applianceNumber].appOff) {
        if (applianceNumber == 0) {
          final_str = "OneOn";
          this.chat.sendMsg("OneOn");
        }
        if (applianceNumber == 1) {
          user.name = "Appliance Two";
          final_str = "TwoOn";
        }
        if (applianceNumber == 2) {
          user.name = "Appliance Three";
          final_str = "ThreeOn";
        }

        this.authService.appOn(user).subscribe(profile => {
          if (profile.success) {
            this.Appliances[applianceNumber].value = true;
            this.chat.sendMsg(final_str);
            resolve(1);
          }
        });
        
      }
      else {
        if (applianceNumber == 0) {
          user.name = "Appliance One";
          final_str = "OneOff";
        }
        if (applianceNumber == 1) {
          user.name = "Appliance Two";
          final_str = "TwoOff";
        }
        if (applianceNumber == 2) {
          user.name = "Appliance Three";
          final_str = "ThreeOff";
        }
        this.authService.appOff(user).subscribe(profile => {
          if (profile.success) {
            this.Appliances[applianceNumber].value = false;
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
      if (data)
        this.refreshAppList();
    });


    console.log(this.leds);
  }

  formatDate(date) {
    var monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var hour = date.getHours();
    var min = date.getMinutes();
    var timeOfDay = 'PM';
    if (hour < 12) {
      timeOfDay = 'AM';
    }
    if (hour > 12) {
      hour -= 12;
      if (hour == 12) {
        timeOfDay = 'AM';
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
    return this.suffixNumber(day) + ' ' + monthNames[monthIndex] + ', '
      + year + ',  '
      + hour + ':'
      + min
      + timeOfDay;
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
    this.msglog.nativeElement.innerHTML += '<br><hr>' + message;
  }

  clear(): void {
    this.msglog.nativeElement.innerHTML = '';
  }
}
