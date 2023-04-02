import {AppState} from "../app.state";
import {createSelector} from "@ngrx/store";
import {AuthState} from "./auth.reducer";

export const selectUser = (state: AppState) => state.user;

export const selectAuthUser = createSelector(
  selectUser,
  (state: AuthState) => state.user
);

export const getAuthUserError = createSelector(
  selectUser,
  (state: AuthState) => state.error
);

export const getAuthUserStatus = createSelector(
  selectUser,
  (state: AuthState) => state.status
);

export const selectAll = createSelector(
  selectUser,
  (state: AuthState) => state
)
