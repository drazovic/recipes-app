import { Action, createReducer, on } from '@ngrx/store';

import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface State {
    user?: User;
}

const initialState: State = {
    user: undefined,
};

const authReducer = createReducer(
    initialState,
    on(AuthActions.login, (state, { email, userId, token, expirationDate }) => {
        const user = new User(email, userId, token, expirationDate);
        return {
            ...state,
            user: user,
        };
    }),
    on(AuthActions.logout, (state) => {
        return {
            ...state,
            user: undefined,
        };
    })
);

export function reducer(state: State | undefined, action: Action) {
    return authReducer(state, action);
}
