import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {WebSocketSubject} from "rxjs/internal/observable/dom/WebSocketSubject";
import {webSocket} from "rxjs/webSocket";

@Injectable()
export class WebSocketService {
  private socket$: WebSocketSubject<any>;
  constructor() {
    this.socket$ = webSocket('ws://localhost:8080/chat');
  }

  joinGroup(groupId: string) {
    this.socket$.next({ action: 'join', data: groupId });
  }

  leaveGroup(groupId: string) {
    this.socket$.next({ action: 'leave', data: groupId });
  }

  sendMessage(groupId: string, message: string) {
    this.socket$.next({ action: 'message', data: { groupId, message } });
  }

  onMessage(): Observable<string> {
    return this.socket$.asObservable();
  }
}
