import {Component, OnInit} from '@angular/core';
import {User} from "../swagger-generated";
import {AppState} from "./state/app.state";
import {Store} from "@ngrx/store";
import {selectAuthUser} from "./state/auth/auth.selectors";
import {autoLogin, storeUser} from "./state/auth/auth.actions";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'chat-app';

  user: User | null = null;

  isLoggedIn = true;

  constructor(private store: Store<AppState>,
              private router: Router) {


  }


  ngOnInit(): void {
    this.store.select(selectAuthUser).subscribe(user=>{
      this.user = user;
    });

    this.store.dispatch(autoLogin());

  }
}
