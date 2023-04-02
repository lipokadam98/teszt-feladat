import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {AppState} from "../app.state";
import {from, map, of, switchMap, withLatestFrom} from "rxjs";
import {catchError} from "rxjs/operators";
import {selectAll} from "./auth.selectors";
import {authFailure, autoLogin, logout, signIn, signUp, storeUser} from "./auth.actions";
import {LoginControllerService, RegistrationControllerService, User} from "../../../swagger-generated";
import {AuthService} from "../../auth/auth.service";


@Injectable()
export class AuthEffects{

  constructor(private actions$: Actions,
              private authService: AuthService,
              private store: Store<AppState>,
              private loginController: LoginControllerService,
              private registerService: RegistrationControllerService) {
  }

  //Ezt is érdemes megfontolni hogy egyik effect hívhat e más statehez tartozó actiont mivel így a másik actionhöz tartozó error kezelése nehézkes
  signUp$ = createEffect(()=>
    this.actions$.pipe(
      ofType(signUp),
      withLatestFrom(this.store.select(selectAll)),
      switchMap(([action])=> from(this.registerService.register({
        firstName: action.firstName,
        lastName: action.lastName,
        email: action.email,
        password: action.password
      })).pipe(
        map((user) => {
          let id = user?.id;
          if(id){
            sessionStorage.setItem("userId",String(id));
          }

          return storeUser({user: user})
        }),
        catchError((error)=> {
          return of(authFailure({error: error?.error?.message}))
        })
      ))
    )
  )


  signIn$ = createEffect(()=>
    this.actions$.pipe(
      ofType(signIn),
      withLatestFrom(this.store.select(selectAll)),
      switchMap(([action])=> from(this.loginController.login({
        email: action.email,
        password: action.password
        })).pipe(
          map(data=> {

            let user: User = {
              id: data.userId
            }
            if(data.loggedIn){

              let id = user?.id;
              if(id){
                sessionStorage.setItem("userId",String(id));
              }
              return storeUser({user: user})
            }
            return authFailure({error: 'Hiba történt a bejelentkezés során'})

          }),
          catchError((error)=> {
            return of(authFailure({error: error?.error?.message}));
          })
        )
      )
    )
  )

  logout$ = createEffect(()=>
      this.actions$.pipe(
        ofType(logout),
        switchMap(()=> this.authService.logout())
      ),
    {dispatch: false}
  )

  autoLogin$ = createEffect(()=>
    this.actions$.pipe(
      ofType(autoLogin),
      switchMap(()=> from(this.authService.autoLogin()).pipe(
          map(token=> {
            if(Object.keys(token).length === 0 && token.constructor === Object){
              return storeUser({user: null})
            } else{
              console.log(token);
              let user: User = {
                id: token
              }
              return storeUser({user: user});

            }
          })
        )
      )
    )
  )

}

