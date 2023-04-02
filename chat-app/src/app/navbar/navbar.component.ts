import { Component } from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../state/app.state";
import {logout} from "../state/auth/auth.actions";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(private store: Store<AppState>) {
  }


  logout(){
    this.store.dispatch(logout());
  }
}
