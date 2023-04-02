import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {map, Observable, take} from 'rxjs';
import {AppState} from "../state/app.state";
import {Store} from "@ngrx/store";
import {selectAuthUser} from "../state/auth/auth.selectors";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardServiceGuard implements CanActivate {

  constructor(private router: Router,
              private store: Store<AppState>) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.select(selectAuthUser).pipe(take(1),map(user=>{

      console.log(user);
      const isAuth =  !!user;
      if(isAuth){
        return true;
      }

      return this.router.createUrlTree(['/login']);
    }))
  }
}
