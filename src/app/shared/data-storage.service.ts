import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';

@Injectable({
    providedIn: 'root',
})
export class DataStorageService {
    constructor(
        private http: HttpClient,
        private recipeService: RecipeService
    ) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http
            .put(
                'https://recipe-app-b5098-default-rtdb.firebaseio.com/recipes.json',
                recipes
            )
            .subscribe((recipes) => {
                console.log(recipes);
            });
    }

    fetchRecipes() {
        return this.http
            .get<Recipe[]>(
                'https://recipe-app-b5098-default-rtdb.firebaseio.com/recipes.json'
            )
            .pipe(
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
                tap((recipes) => {
                    this.recipeService.setRecipes(recipes);
                })
            );
    }
}
