import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  ChatRoom,
  ChatRoomControllerService,
  Message,
  MessageDto,
  User,
  UserControllerService
} from "../../../swagger-generated";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {AppState} from "../../state/app.state";
import {selectAuthUser} from "../../state/auth/auth.selectors";
import {WebSocketService} from "../../services/web-socket.service";
import {Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy{
  groupId = '';
  messages: Message[] = [];
  room: ChatRoom | undefined  = {};
  roomId = 0;
  user: User | null = null;
  intervalId: any;
  paramsSub = new Subscription();
  webSocketSub = new Subscription();

  constructor(private userService: UserControllerService,
              private chatRoomController: ChatRoomControllerService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar,
              private webSocketService: WebSocketService,
              private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.paramsSub = this.activatedRoute.params.subscribe(data=>{
      this.roomId = +data['id'];
      this.groupId = data['id'];

      this.selectChatRoom(this.roomId);
      this.getMessages(this.roomId);

    });

    this.webSocketService.joinGroup(this.groupId);

   this.webSocketSub = this.webSocketService.onMessage().pipe()
      .subscribe(message => {
        let webSocketData = JSON.parse(JSON.stringify(message));

        if(webSocketData?.data?.groupId === this.groupId ){
          this.messages.push(JSON.parse(webSocketData?.data?.message));
          setTimeout(()=>{this.scrollToBottom()},50);
        }
      });

    this.store.select(selectAuthUser).subscribe(user=>{
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.webSocketSub.unsubscribe();
    this.webSocketService.leaveGroup(this.groupId);
    this.paramsSub.unsubscribe();
    clearInterval(this.intervalId);
  }

  selectChatRoom(id: number){
    this.chatRoomController.getChatRoomById(id).subscribe(room=>{
      this.room = room;
    });
  }

  getMessages(id: number){
    this.chatRoomController.getMessages(+id).subscribe({
      next: this.handleMessagesLoad.bind(this),
      error: this.handleMessagesLoadError.bind(this)
    });
  }

  handleMessagesLoad(messages: Message[]){
    this.messages = messages;
    setTimeout(()=>{this.scrollToBottom()},50);
  }
  handleMessagesLoadError(_error: string){
    this.snackBar.open("Hiba történt az üzenetek betöltése során!","OK!",{duration: 5000});
  }

  addMessage(value: string) {
    let messageDto: MessageDto = {
      message: value,
      userId: this.user?.id!
    }
    this.chatRoomController.sendMessage(messageDto,this.roomId).subscribe({
      next: this.sendMessage.bind(this),
      error: this.sendMessageError.bind(this)
    });
  }

  sendMessage(message: Message){
    this.webSocketService.sendMessage(this.groupId,JSON.stringify(message));
    this.messages.push(message);
    setTimeout(()=>{this.scrollToBottom()},50);
  }

  sendMessageError(_error: string){
    this.snackBar.open("Hiba történt az üzenet küldése során!","OK!",{duration: 5000});
  }

  scrollToBottom(){
    let messageDiv = document.getElementById("messages");
    if(messageDiv){
      messageDiv.scrollTop = messageDiv.scrollHeight;
    }

  }

  onBack(){
    this.router.navigate(['']).then();
  }
}
