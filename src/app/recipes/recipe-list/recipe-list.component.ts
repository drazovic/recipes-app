import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Recipe } from '../recipe.model';
import * as fromApp from '../../store/app.reducer';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-recipe-list',
    templateUrl: './recipe-list.component.html',
    styleUrls: ['./recipe-list.component.scss'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
    recipes: Recipe[] = [];
    recipesChangedSubscription: Subscription;

    constructor(private store: Store<fromApp.AppState>) {}

    ngOnInit(): void {
        this.recipesChangedSubscription = this.store
            .select('recipes')
            .pipe(map((recipesState) => recipesState.recipes))
            .subscribe((recipes: Recipe[]) => {
                this.recipes = recipes;
            });
    }

    ngOnDestroy(): void {
        this.recipesChangedSubscription.unsubscribe();
    }
}
