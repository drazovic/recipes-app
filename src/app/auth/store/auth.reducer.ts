import { Action, createReducer, on } from '@ngrx/store';

import { User } from '../user.model';

export interface State {
    user?: User;
}

const initialState: State = {
    user: undefined,
};

const authReducer = createReducer(initialState);

export function reducer(state: State | undefined, action: Action) {
    return authReducer(state, action);
}
