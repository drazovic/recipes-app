import { Injectable, EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

import { Recipe } from './recipe.model';

@Injectable({
    providedIn: 'root',
})
export class RecipeService {
    recipeSelected = new EventEmitter<Recipe>();

    private recipes: Recipe[] = [
        new Recipe(
            'Pasta',
            'Nice recipe',
            'https://hips.hearstapps.com/delish/assets/17/36/1504715566-delish-fettuccine-alfredo.jpg',
            [new Ingredient('Pasta', 1), new Ingredient('Meat', 1)]
        ),
    ];

    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe() {
        
    }
}