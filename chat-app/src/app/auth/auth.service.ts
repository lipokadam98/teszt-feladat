import { Injectable } from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  autoLogin(){

    const token = JSON.parse(sessionStorage.getItem('userId') || '{}');

    if(!token){
      return Promise.resolve();
    }

    return Promise.resolve(token);
  }

  logout(){
    sessionStorage.removeItem('userId');
    this.router.navigate(['login']).then();
    /*if(this.tokenExpirationTimer){
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;*/
    return Promise.resolve();
  }

}
