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
    }))
);

export function reducer(state: State | undefined, action: Action) {
    return recipesReducer(state, action);
}
