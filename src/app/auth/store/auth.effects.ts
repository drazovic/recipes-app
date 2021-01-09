import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../user.model';

import * as AuthActions from './auth.actions';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuthentication = (responseData: AuthResponseData) => {
    const expirationDate = new Date(
        new Date().getTime() + +responseData.expiresIn * 1000
    );
    const user = new User(
        responseData.email,
        responseData.localId,
        responseData.idToken,
        expirationDate
    );
    localStorage.setItem('userData', JSON.stringify(user));
    return AuthActions.authenticateSuccess({
        email: responseData.email,
        userId: responseData.localId,
        token: responseData.idToken,
        expirationDate: expirationDate,
    });
};

const handleError = (errorResponse: HttpErrorResponse) => {
    let errorMessage = 'An error occured.';
    if (!errorResponse.error || !errorResponse.error.error) {
        return of(
            AuthActions.authenticateFail({
                authError: errorMessage,
            })
        );
    }
    switch (errorResponse.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage =
                'The email address is already in use by another account.';
            break;
        case 'EMAIL_NOT_FOUND':
            errorMessage =
                'There is no user record corresponding to this identifier. The user may have been deleted.';
            break;
        case 'INVALID_PASSWORD':
            errorMessage =
                'The password is invalid or the user does not have a password.';
            break;
    }
    return of(
        AuthActions.authenticateFail({
            authError: errorMessage,
        })
    );
};

@Injectable()
export class AuthEffects {
    authSignup$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.signupStart),
            switchMap(({ email, password }) => {
                return this.http
                    .post<AuthResponseData>(
                        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
                        {
                            email: email,
                            password: password,
                            returnSecureToken: true,
                        }
                    )
                    .pipe(
                        map((responseData) => {
                            return handleAuthentication(responseData);
                        }),
                        catchError((errorResponse: HttpErrorResponse) => {
                            return handleError(errorResponse);
                        })
                    );
            })
        )
    );

    authLogin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.loginStart),
            switchMap(({ email, password }) => {
                return this.http
                    .post<AuthResponseData>(
                        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
                        {
                            email: email,
                            password: password,
                            returnSecureToken: true,
                        }
                    )
                    .pipe(
                        map((responseData) => {
                            return handleAuthentication(responseData);
                        }),
                        catchError((errorResponse: HttpErrorResponse) => {
                            return handleError(errorResponse);
                        })
                    );
            })
        )
    );

    authRedirect$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.authenticateSuccess, AuthActions.logout),
                tap(() => {
                    this.router.navigate(['/']);
                })
            ),
        { dispatch: false }
    );

    authLogout$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.logout),
                tap(() => {
                    localStorage.removeItem('userData');
                })
            ),
        { dispatch: false }
    );

    autoLogin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.autoLogin),
            map(() => {
                const stringifiedUserData = localStorage.getItem('userData');
                if (!stringifiedUserData) {
                    return { type: 'Dummy' };
                }

                const userData: {
                    email: string;
                    id: string;
                    _token: string;
                    _tokenExpirationDate: string;
                } = JSON.parse(stringifiedUserData);
                const loadedUser = new User(
                    userData.email,
                    userData.id,
                    userData._token,
                    new Date(userData._tokenExpirationDate)
                );

                if (loadedUser.token) {
                    return AuthActions.authenticateSuccess({
                        email: loadedUser.email,
                        userId: loadedUser.id,
                        token: loadedUser.token,
                        expirationDate: new Date(userData._tokenExpirationDate),
                    });

                    // const expirationDuration =
                    //     new Date(userData._tokenExpirationDate).getTime() -
                    //     new Date().getTime();
                    // this.autoLogout(expirationDuration);
                } else {
                    return { type: 'Dummy' };
                }
            })
        )
    );

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router
    ) {}
}
