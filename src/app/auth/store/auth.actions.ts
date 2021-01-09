import { createAction, props } from '@ngrx/store';

export const loginStart = createAction(
    '[Auth] Login Start',
    props<{
        email: string;
        password: string;
    }>()
);

export const authenticateSuccess = createAction(
    '[Auth] Authenticate Success',
    props<{
        email: string;
        userId: string;
        token: string;
        expirationDate: Date;
    }>()
);

export const authenticateFail = createAction(
    '[Auth] Authenticate Fail',
    props<{
        authError: string;
    }>()
);

export const signupStart = createAction(
    '[Auth] Signup Start',
    props<{
        email: string;
        password: string;
    }>()
);

export const clearError = createAction('[Auth] Clear Error');

export const logout = createAction('[Auth] logout');

export const autoLogin = createAction('[Auth] Auto Login');
