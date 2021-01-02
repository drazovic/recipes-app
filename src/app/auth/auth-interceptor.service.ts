import {
    HttpHandler,
    HttpInterceptor,
    HttpParams,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { exhaustMap, map, take } from 'rxjs/operators';

import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterseptorService implements HttpInterceptor {
    constructor(private store: Store<fromApp.AppState>) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.store.select('auth').pipe(
            take(1),
            map((authState) => authState.user),
            exhaustMap((user) => {
                if (!user || !user.token) {
                    return next.handle(req);
                }

                const modifiedRequest = req.clone({
                    params: new HttpParams().set('auth', user.token),
                });
                return next.handle(modifiedRequest);
            })
        );
    }
}
