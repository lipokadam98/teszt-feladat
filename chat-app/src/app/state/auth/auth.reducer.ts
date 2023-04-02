
import {createReducer, on} from "@ngrx/store";

import {authFailure, storeUser, logout, signUp, signIn} from "./auth.actions";
import {User} from "../../../swagger-generated";

export interface AuthState {
  user: User | null;
  error: string | null;
  status: 'pending' | 'loading' | 'error' | 'success';
}

export const initialState: AuthState = {
  user: null,
  error: null,
  status: 'pending'
}

export const authReducer = createReducer(
  initialState,

  on(storeUser, (state, {user})=> ({
    ...state,
    user: user,
    status: 'success'
  })),

  on(signUp, (state) =>({
    ...state,
    status: 'pending',
    error: null
  })),

  on(signIn, (state) =>({
    ...state,
    status: 'pending',
    error: null
  })),

  on(authFailure, (state, {error})=> ({
    ...state,
    user: null,
    error: error,
    status: 'error'
  })),

  on(logout, (state)=> ({
    ...state,
    user: null,
    error: null,
    status: 'pending'
  }))
)
