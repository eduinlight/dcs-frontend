import {catchError, take, tap} from 'rxjs/operators';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {of} from 'rxjs';

import {AuthStateModel, initAuthStateModel} from './auth-state.model';
import {AuthService} from '../services/auth.service';
import {
  AuthErrorAction,
  LoginAction,
  LoginWithProviderAction,
  LogoutAction,
  MeAction,
  UpdateMeAction,
  UpdateMyAvatarAction
} from '../actions';
import {AuthError, User} from '../models';
import {Router} from '@angular/router';
import {NgZone} from '@angular/core';
import {LoginResponseModel} from '../models/login-response.model';
import {Role} from '../../permissions';

@State<AuthStateModel>({
  name: 'auth',
  defaults: initAuthStateModel()
})
export class AuthState {

  @Selector()
  static token(state: AuthStateModel): string {
    return state.token;
  }

  @Selector()
  static me(state: AuthStateModel): User {
    return state.me;
  }

  @Selector()
  static role(state: AuthStateModel): Role {
    return state.me && state.me.role || null;
  }

  @Selector()
  static authError(state: AuthStateModel): AuthError {
    return state.error;
  }

  constructor(private authService: AuthService, private router: Router, private zone: NgZone) {
  }

  @Action(LoginAction)
  loginAction(ctx: StateContext<AuthStateModel>, action: LoginAction) {
    return this.authService.login(action.identifier, action.password).pipe(
      tap((authData: LoginResponseModel) => ctx.patchState({token: authData.jwt, error: null})),
      catchError(() => {
        ctx.patchState({
          error: {id: new Date().getTime(), title: 'Invalid credentials'} as AuthError
        });
        return of({});
      })
    );
  }

  @Action(LoginWithProviderAction)
  loginWithProviderAction(ctx: StateContext<AuthStateModel>, action: LoginWithProviderAction) {
    return this.authService.loginWithProvider(action.provider, action.code).pipe(
      tap((jwt: string) => {
        ctx.patchState({token: jwt, error: null});
        if (jwt) {
          this.zone.run(() => {
            this.router.navigate(['dashboard']);
          });
        }
      }),
      catchError(() => {
        ctx.patchState({
          error: {id: new Date().getTime(), title: 'Invalid credentials'} as AuthError
        });
        return of({});
      })
    );
  }

  @Action(LogoutAction)
  logoutAction(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({token: '', me: {} as User, error: null});
  }

  @Action(AuthErrorAction)
  authErrorAction(ctx: StateContext<AuthStateModel>, action: AuthErrorAction) {
    ctx.patchState({error: {id: new Date().getTime(), title: action.title} as AuthError});
  }

  @Action(MeAction)
  meAction(ctx: StateContext<AuthStateModel>) {
    return this.authService.me().pipe(
      tap((me: User) => ctx.patchState({me})),
      take(1)
    );
  }

  @Action(UpdateMeAction)
  updateMeAction(ctx: StateContext<AuthStateModel>, action: UpdateMeAction) {
    return this.authService.updateMeAction(action.id, action.email, action.page).pipe(
      tap((me: User) => ctx.patchState({me}))
    );
  }

  @Action(UpdateMyAvatarAction)
  updateMyAvatarAction(ctx: StateContext<AuthStateModel>, action: UpdateMyAvatarAction) {
    return this.authService.updateMyAvatarAction(action.id, action.avatar).pipe(
      tap((me: User) => ctx.patchState({me}))
    );
  }
}
