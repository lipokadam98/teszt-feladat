import {Component, OnInit} from '@angular/core';
import {ChatRoom, ChatRoomControllerService} from "../../swagger-generated";

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

}
