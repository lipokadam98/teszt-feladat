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

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy{
  rooms: ChatRoom[] = [];

  groupId = '';
  messages: Message[] = [];
  room: ChatRoom | undefined  = {};
  roomId = 0;
  user: User | null = null;
  intervalId: any;
  socket: WebSocket | undefined;

  paramsSub = new Subscription();
  webSocketSub = new Subscription();

  constructor(private userService: UserControllerService,
              private chatRoomController: ChatRoomControllerService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
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
    this.chatRoomController.getAllChatRoom().subscribe(rooms=>{
      this.rooms = rooms;
       this.rooms.forEach(room=>{
        if(room.id === +id){
          this.room = room;
        }
      })

    });
  }

  getMessages(id: number){
    this.chatRoomController.getMessages(+id).subscribe(messages=>{
      this.messages = messages;
      setTimeout(()=>{this.scrollToBottom()},50);
    });
  }

  addMessage(value: string) {
    let messageDto: MessageDto = {
      message: value,
      userId: this.user?.id!
    }
    this.chatRoomController.sendMessage(messageDto,this.roomId).subscribe(data=>{
      this.webSocketService.sendMessage(this.groupId,JSON.stringify(data));
      this.messages.push(data);
      setTimeout(()=>{this.scrollToBottom()},50);

    })
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
