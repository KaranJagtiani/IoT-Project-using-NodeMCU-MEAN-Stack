import { Injectable } from "@angular/core";
import { SocketService } from "../socket/socket.service";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ChatService {
  messages: Subject<any>;

  // The constructor calls our socketService connect method
  constructor(private socketService: SocketService) {
    this.messages = <Subject<any>>socketService.connect().pipe(
      map((response: any): any => {
        return response;
      })
    );
  }

  // Sending messages back to our socket.io server
  sendMsg(msg) {
    this.messages.next(msg);
  }
}
