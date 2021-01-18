import { createAction, props } from '@ngrx/store';
import { Recipe } from '../recipe.model';

export const setRecipes = createAction(
    '[Recipes] Set Recipes',
    props<{ recipes: Recipe[] }>()
);

export const fetchRecipes = createAction('[Recipes] Fetch Recipes');
