import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = 'http://localhost:3000';
  private socket;


  constructor() {
  }

  public sendMessage(message) {
    this.socket.emit('new-message',
      {
        from: 'User',
        text: message
      },
      (back) => {
        console.log(back);
      });
  }

  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('new-message',
        (message) => {
          observer.next(message);
        });
    });
  }


  connect(): Subject<MessageEvent> {
    this.socket = io(this.url);

    // Observable which will observe any incoming messages from our socket.io server.
    let observable = new Observable(observer => {
      this.socket.on('new-message', (data) => {
        observer.next(data);
      })
      return () => {
        this.socket.disconnect();
      }
    });

    // Observer which will listen to messages from the other 
    // components and send messages back to our socket server
    let observer = {
      next: (data: Object) => {
        this.socket.emit('new-message', JSON.stringify(data));
      },
    };

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Subject.create(observer, observable);
  }
}
