import {Component, OnInit} from '@angular/core';
import {User, UserControllerService} from "../../swagger-generated";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: User[] = [];

  constructor(private userControllerService: UserControllerService) {

  }

  ngOnInit(): void {
    this.userControllerService.getAllUsers().subscribe(data => {
      this.users = data;
    });
  }


}
