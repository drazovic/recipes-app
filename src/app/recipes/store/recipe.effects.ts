import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';

import { AuthService } from 'src/app/auth/auth.service';
import { Recipe } from '../recipe.model';
import * as RecipesActions from '../store/recipe.actions';

@Injectable()
export class RecipeEffects {
    fetchRecipes$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RecipesActions.fetchRecipes),
            switchMap(() => {
                return this.http.get<Recipe[]>(
                    'https://recipe-app-b5098-default-rtdb.firebaseio.com/recipes.json'
                );
            }),
            map((recipes) => {
                return recipes.map((recipe) => {
                    return {
                        ...recipe,
                        ingredients: recipe.ingredients
                            ? recipe.ingredients
                            : [],
                    };
                });
            }),
            map((recipes) => {
                return RecipesActions.setRecipes({
                    recipes: recipes,
                });
            })
        )
    );

    constructor(private actions$: Actions, private http: HttpClient) {}
}
