import { Action, createReducer, on } from '@ngrx/store';

import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
    user?: User;
    authError: string;
    loading: boolean;
}

const initialState: State = {
    user: undefined,
    authError: '',
    loading: false,
};

const authReducer = createReducer(
    initialState,
    on(AuthActions.loginStart, AuthActions.signupStart, (state) => ({
        ...state,
        authError: '',
        user: undefined,
        loading: true,
    })),
    on(
        AuthActions.authenticateSuccess,
        (state, { email, userId, token, expirationDate }) => ({
            ...state,
            authError: '',
            user: new User(email, userId, token, expirationDate),
            loading: false,
        })
    ),
    on(AuthActions.authenticateFail, (state, { authError }) => ({
        ...state,
        authError: authError,
        user: undefined,
        loading: false,
    })),
    on(AuthActions.clearError, (state) => ({
        ...state,
        authError: '',
    })),
    on(AuthActions.logout, (state) => ({
        ...state,
        user: undefined,
    }))
);

export function reducer(state: State | undefined, action: Action) {
    return authReducer(state, action);
}
