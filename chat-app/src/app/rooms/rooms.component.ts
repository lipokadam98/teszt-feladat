import {Component, OnInit} from '@angular/core';
import {ChatRoom, ChatRoomControllerService, ChatRoomUserDto} from "../../swagger-generated";

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit{
  rooms: ChatRoom[] = [];

  constructor(private chatRoomController: ChatRoomControllerService) {
  }

  ngOnInit(): void {
   this.getRooms();
  }

  getRooms(){
    this.chatRoomController.getAllChatRoom().subscribe(rooms=>{
      console.log(rooms);
      this.rooms = rooms;
    });
  }

  createRoom(name: string){
    let chatRoom: ChatRoom = {
      name: name
    }
    this.chatRoomController.createChatRoom(chatRoom).subscribe(data=>{
      this.rooms = [data, ...this.rooms];
    });
  }

  joinRoom(roomId: number | undefined){

    if(roomId === undefined){
      return;
    }
    let chatRoomUserDto: ChatRoomUserDto = {
      userId: 1,
      email: "lipokadam98@gmail.com"
    }
    this.chatRoomController.addUserToChatRoom(chatRoomUserDto,roomId!).subscribe(data=>{
      console.log(data);
    });
  }

  leaveRoom(){

  }

}
