import { createAction, props } from '@ngrx/store';
import { Recipe } from '../recipe.model';

export const setRecipes = createAction(
    '[Recipes] Set Recipes',
    props<{ recipes: Recipe[] }>()
);

export const fetchRecipes = createAction('[Recipes] Fetch Recipes');

export const addRecipe = createAction('[Recipes] Add Recipes', props<Recipe>());

export const updateRecipe = createAction(
    '[Recipes] Update Recipes',
    props<{ index: number; newRecipe: Recipe }>()
);

export const deleteRecipe = createAction(
    '[Recipes] Delete Recipes',
    props<{ index: number }>()
);

export const storeRecipes = createAction(
    '[Recipes] Store Recipes'
);

