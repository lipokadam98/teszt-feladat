import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {AppState} from "../state/app.state";
import {getAuthUserError, selectAuthUser} from "../state/auth/auth.selectors";
import {signIn, signUp} from "../state/auth/auth.actions";
import Swal from 'sweetalert2';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  authFormGroup: FormGroup = new FormGroup({});
  authSub = new Subscription();

  isLogin = true;
  constructor(private router: Router,
              private store: Store<AppState>) { }

  ngOnInit(): void {
    this.authFormGroup = new FormGroup({
      'email': new FormControl('lipokadam98@gmail.com',[Validators.required,Validators.email,Validators.maxLength(255)]),
      'firstname': new FormControl(null,[Validators.required,Validators.maxLength(255)]),
      'lastname': new FormControl(null,[Validators.required,Validators.maxLength(255)]),
      'password': new FormControl('12345678',[Validators.required,Validators.minLength(6),Validators.maxLength(60)])
    });

    this.store.select(selectAuthUser).subscribe(user=>{
      if(user){
        this.router.navigate(['']).then();
      }
    });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }


  authenticate(){

    const email = this.authFormGroup.get('email')?.value;
    const password = this.authFormGroup.get('password')?.value;
    const firstName = this.authFormGroup.get('firstname')?.value;
    const lastName = this.authFormGroup.get('lastname')?.value;

    if(this.isLogin){
      this.store.dispatch(signIn({email,password}));
    }else{
      this.store.dispatch(signUp({email,password,firstName,lastName}));
    }

    this.authSub = this.store.select(getAuthUserError).subscribe(error=>{
      if(error){
        this.handleAuthError(error);
      }
    });
  }

  handleAuthError(error: string){
    Swal.fire({
      title: 'Hiba történt a bejelentkezés során!',
      text: error,
      icon: 'error',
      confirmButtonText: 'Ok'
    }).then();
  }

  checkDisabled(){
    if(this.isLogin){
      if(!this.authFormGroup.get('password')?.invalid &&
        !this.authFormGroup.get('email')?.invalid){
        return false;
      }
    }else{
      if(!this.authFormGroup.get('firstname')?.invalid &&
        !this.authFormGroup.get('lastname')?.invalid &&
        !this.authFormGroup.get('email')?.invalid){
        return false;
      }
    }
    return true;
  }

  switchMode(){
    this.isLogin = !this.isLogin;
  }

  emailValidation(){

    if (this.authFormGroup.get('email')?.hasError('required')) {
      return 'E-mail megadása kötelező';
    }

    return this.authFormGroup.get('email')?.hasError('email') ? 'Hibás e-mail formátum' : '';
  }

  passwordValidation(){
    if (this.authFormGroup.get('password')?.hasError('required')) {
      return 'Jelszó megadása kötelező';
    }

    return this.authFormGroup.get('password')?.hasError('minlength') ? 'A jelszó hossza legalább 6 karakter legyen' : '';
  }

}
