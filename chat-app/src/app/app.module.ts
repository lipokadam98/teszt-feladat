import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthComponent} from './auth/auth.component';
import {HomeComponent} from './home/home.component';
import {NavbarComponent} from './navbar/navbar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RoomsComponent} from './rooms/rooms.component';
import {HttpClientModule} from "@angular/common/http";
import {MatTooltipModule} from "@angular/material/tooltip";
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {AuthEffects} from "./state/auth/auth.effects";
import {authReducer} from "./state/auth/auth.reducer";
import {ReactiveFormsModule} from "@angular/forms";
import {RoomComponent} from './rooms/room/room.component';
import {UsersComponent} from './users/users.component';
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import {WebSocketService} from "./services/web-socket.service";

const config: SocketIoConfig = { url: 'ws://localhost:8080/chat', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    NavbarComponent,
    RoomsComponent,
    RoomComponent,
    UsersComponent
  ],
  imports: [
    SocketIoModule.forRoot(config),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    HttpClientModule,
    MatButtonModule,
    MatTooltipModule,
    StoreModule.forRoot({user: authReducer}),
    EffectsModule.forRoot([AuthEffects]),
    ReactiveFormsModule,
  ],
  providers: [WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
