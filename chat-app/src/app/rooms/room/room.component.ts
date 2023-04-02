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

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy{
  rooms: ChatRoom[] = [];

  messages: Message[] = [];
  room: ChatRoom | undefined  = {};
  roomId = 0;
  user: User | null = null;
  intervalId: any;
  constructor(private userService: UserControllerService,
              private chatRoomController: ChatRoomControllerService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(data=>{
      this.roomId = +data['id'];
      this.selectChatRoom(this.roomId);
      this.getMessages(this.roomId);
    });

    this.store.select(selectAuthUser).subscribe(user=>{
      this.user = user;
    });

    this.intervalId = setInterval(()=>this.getMessages(this.roomId), 1000);


  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  selectChatRoom(id: number){
    this.chatRoomController.getAllChatRoom().subscribe(rooms=>{
      this.rooms = rooms;
       this.rooms.forEach(room=>{
        if(room.id === +id){

          this.room = room;
          console.log(this.room);
        }
      })

    });
  }

  getMessages(id: number){
    this.chatRoomController.getMessages(+id).subscribe(messages=>{
      this.messages = messages;
      this.scrollToBottom();
    });
  }

  addMessage(value: string) {
    let messageDto: MessageDto = {
      message: value,
      userId: this.user?.id!
    }
    this.chatRoomController.sendMessage(messageDto,this.roomId).subscribe(data=>{
      this.getMessages(this.roomId);
    });


  }

  scrollToBottom(){
    let messageDiv = document.getElementById("messages");
    if(messageDiv){
      messageDiv.scrollTop = messageDiv.scrollHeight;
    }

  }

  onBack(){
    this.router.navigate(['']);
  }
}
