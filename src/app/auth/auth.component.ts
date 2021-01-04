import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit, OnDestroy {
    isLoginMode = true;
    isLoading = false;
    error: string | null;

    private storeSubscription: Subscription;

    constructor(private store: Store<fromApp.AppState>) {}

    ngOnInit(): void {
        this.storeSubscription = this.store
            .select('auth')
            .subscribe((authState) => {
                this.isLoading = authState.loading;
                this.error = authState.authError;
            });
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }
        const email = form.value.email;
        const password = form.value.password;

        this.isLoading = true;
        if (this.isLoginMode) {
            this.store.dispatch(
                AuthActions.loginStart({ email: email, password: password })
            );
        } else {
            this.store.dispatch(
                AuthActions.signupStart({ email: email, password: password })
            );
        }

        form.reset();
    }

    onHandleError() {
        this.store.dispatch(AuthActions.clearError());
    }

    ngOnDestroy() {
        this.storeSubscription.unsubscribe();
    }
}
