import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap, map, tap } from 'rxjs/operators';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/service/auth.service';

import * as AuthActions from './auth.actions';


export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: string;
}

const handleAuthentication = (resData) => {
    const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
    const user = new User(resData.email, resData.localId, resData.idToken, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess({ email: resData.email, userId: resData.localId, token: resData.idToken, expirationDate: expirationDate, redirect: true })
};

const handleError = (errorResponse) => {
    let errorMessage = 'An unknown error occured!';
    if (!errorResponse.error || !errorResponse.error.error) {
        return of(new AuthActions.AuthenticateFail(errorMessage));
    }
    switch (errorResponse.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = 'This email exists already!';
            break;
        case 'EMAIL_NOT_FOUND':
            errorMessage = 'This email does not exist!';
            break;
        case 'INVALID_PASSWORD':
            errorMessage = 'This password is not correct!';
            break;
    }
    return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAp725HFXL5cIWqpd05x-xMx8OKJG58W8g',
                {
                    email: signupAction.payload.email,
                    password: signupAction.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                tap(resData => {
                    this.authService.setLogoutTimer(+resData.expiresIn * 1000)
                }),
                map(resData => {
                    return handleAuthentication(resData)
                }), catchError(errorResponse => {
                    return handleError(errorResponse)
                })
            )
        })
    )

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http
                .post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAp725HFXL5cIWqpd05x-xMx8OKJG58W8g',
                    {
                        email: authData.payload.email,
                        password: authData.payload.password,
                        returnSecureToken: true
                    }
                ).pipe(
                    tap(resData => {
                        this.authService.setLogoutTimer(+resData.expiresIn * 1000)
                    }),
                    map(resData => {
                        return handleAuthentication(resData)
                    }), 
                    catchError(errorResponse => {
                        return handleError(errorResponse)
                    })
                )
        })
    );

    @Effect({ dispatch: false })
    authLogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT), 
        tap(() => {
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
        })
    );

    @Effect({ dispatch: false })
    authRedirect = this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authSuccessAction : AuthActions.AuthenticateSuccess)=> {
            if(authSuccessAction.payload.redirect){
                this.router.navigate(['/']);
            }
            
        })
    );

    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData: { email: string, id: string, _token: string, _tokenExpirationDate: string } = JSON.parse(localStorage.getItem('userData'));
            if (!userData) {
                return { type : 'DUMMY' };;
            }

            const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

            if (loadedUser.token) {
                const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                this.authService.setLogoutTimer(expirationDuration);
                return new AuthActions.AuthenticateSuccess(
                        { 
                            email: loadedUser.email, 
                            userId: loadedUser.id, 
                            token: loadedUser.token, 
                            expirationDate: new Date(userData._tokenExpirationDate), 
                            redirect: false 
                        });
            }

            return { type : 'DUMMY' };
        })
    );

    

    constructor(private authService : AuthService, private actions$: Actions, private http: HttpClient, private router: Router) { }
}