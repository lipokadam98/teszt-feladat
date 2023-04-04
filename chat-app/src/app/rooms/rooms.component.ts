import {Component, OnInit} from '@angular/core';
import {ChatRoom, ChatRoomControllerService} from "../../swagger-generated";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit{
  rooms: ChatRoom[] = [];
  constructor(private chatRoomController: ChatRoomControllerService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
   this.getRooms();
  }

  getRooms(){
    this.chatRoomController.getAllChatRoom().subscribe({
      next: this.handleChatRoomLoad.bind(this),
      error: this.handleChatRoomLoadError.bind(this)
    });
  }

  handleChatRoomLoad(chatRooms: ChatRoom[]){
    this.rooms = chatRooms;
  }
  handleChatRoomLoadError(_error: string){
    this.snackBar.open("Hiba történt a szobák betöltése során!","OK!",{duration: 5000});
  }

  createRoom(name: string){
    let chatRoom: ChatRoom = {
      name: name
    }
    this.chatRoomController.createChatRoom(chatRoom).subscribe({
      next: this.handleChatRoomCreate.bind(this),
      error: this.handleChatRoomCreateError.bind(this)
    });
  }

  handleChatRoomCreate(chatRoom: ChatRoom){
    this.rooms = [chatRoom, ...this.rooms];
  }
  handleChatRoomCreateError(_error: string){
    this.snackBar.open("Hiba történt a szoba létrehozása során!","OK!",{duration: 5000});
  }

}
