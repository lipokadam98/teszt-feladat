import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {AuthComponent} from "./auth/auth.component";
import {AuthGuardServiceGuard} from "./auth/auth-guard-service.guard";
import {RoomComponent} from "./rooms/room/room.component";

const routes: Routes = [
  {path: '', canActivate: [AuthGuardServiceGuard],component: HomeComponent},
  {path: 'room/:id',canActivate: [AuthGuardServiceGuard],  component: RoomComponent},
  {path: 'login',component: AuthComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
