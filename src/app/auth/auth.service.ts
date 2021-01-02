import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';

import { User } from './user.model';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private tokenExpirationTimer: any;

    constructor(
        private http: HttpClient,
        private router: Router,
        private store: Store<fromApp.AppState>
    ) {}

    signup(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
                { email: email, password: password, returnSecureToken: true }
            )
            .pipe(
                catchError(this.handleError),
                tap(this.handleAuthentication.bind(this))
            );
    }

    login(email: string, password: string) {
        return this.http
            .post<AuthResponseData>(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
                { email: email, password: password, returnSecureToken: true }
            )
            .pipe(
                catchError(this.handleError),
                tap(this.handleAuthentication.bind(this))
            );
    }

    autoLogin() {
        const stringifiedUserData = localStorage.getItem('userData');
        if (!stringifiedUserData) {
            return;
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
            this.store.dispatch(
                AuthActions.login({
                    email: loadedUser.email,
                    userId: loadedUser.id,
                    token: loadedUser.token,
                    expirationDate: new Date(userData._tokenExpirationDate),
                })
            );
            const expirationDuration =
                new Date(userData._tokenExpirationDate).getTime() -
                new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout() {
        this.store.dispatch(AuthActions.logout());
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
    }

    private autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(responseData: AuthResponseData) {
        const expirationDate = new Date(
            new Date().getTime() + +responseData.expiresIn * 1000
        );
        const user = new User(
            responseData.email,
            responseData.localId,
            responseData.idToken,
            expirationDate
        );
        this.store.dispatch(
            AuthActions.login({
                email: responseData.email,
                userId: responseData.localId,
                token: responseData.idToken,
                expirationDate: expirationDate,
            })
        );
        this.autoLogout(+responseData.expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = 'An error occured.';
        if (!errorResponse.error || !errorResponse.error.error) {
            throwError(errorMessage);
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
        return throwError(errorMessage);
    }
}
