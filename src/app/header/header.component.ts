import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataStorageService } from '../shared/data-storage.service';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated = false;
    private userSubscription: Subscription;

    constructor(
        private dataStorageService: DataStorageService,
        private store: Store<fromApp.AppState>
    ) {}

    ngOnInit(): void {
        this.userSubscription = this.store
            .select('auth')
            .pipe(map((authState) => authState.user))
            .subscribe((user) => {
                this.isAuthenticated = !!user;
            });
    }

    onSaveData() {
        this.dataStorageService.storeRecipes();
    }

    onFetchData() {
        this.store.dispatch(RecipeActions.fetchRecipes());
    }

    onLogout() {
        this.store.dispatch(AuthActions.logout());
    }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();
    }
}
