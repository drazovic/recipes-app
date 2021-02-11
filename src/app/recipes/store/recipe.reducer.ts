import { Action, createReducer, on } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipe.actions';

export interface State {
    recipes: Recipe[];
}

const initialState: State = {
    recipes: [],
};

const recipesReducer = createReducer(
    initialState,
    on(RecipesActions.setRecipes, (state, { recipes }) => ({
        ...state,
        recipes: [...recipes],
    })),
    on(RecipesActions.addRecipe, (state, newRecipe) => ({
        ...state,
        recipes: [...state.recipes, newRecipe],
    })),
    on(RecipesActions.updateRecipe, (state, { index, newRecipe }) => {
        const updatedRecipe = { ...state.recipes[index], ...newRecipe };

        const updatedRecipes = [...state.recipes];
        updatedRecipes[index] = updatedRecipe;

        return {
            ...state,
            recipes: updatedRecipes,
        };
    }),
    on(RecipesActions.deleteRecipe, (state, { index }) => ({
        ...state,
        recipes: state.recipes.filter((recipe, index) => index !== index),
    }))
);

export function reducer(state: State | undefined, action: Action) {
    return recipesReducer(state, action);
}
