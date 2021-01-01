import { Action, createReducer, on } from '@ngrx/store';

import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
    ingredients: Ingredient[];
    editedIngredient?: Ingredient;
    editedIngredientIndex: number;
}

const initialState: State = {
    ingredients: [new Ingredient('eggs', 3), new Ingredient('apples', 4)],
    editedIngredientIndex: -1,
};

const shoppingListReducer = createReducer(
    initialState,
    on(ShoppingListActions.addIngredient, (state, { ingredient }) => ({
        ...state,
        ingredients: [...state.ingredients, ingredient],
    })),
    on(ShoppingListActions.addIngredients, (state, { ingredients }) => ({
        ...state,
        ingredients: [...state.ingredients, ...ingredients],
    })),
    on(ShoppingListActions.updateIngredient, (state, { newIngredient }) => {
        const ingredient = state.ingredients[state.editedIngredientIndex];
        const updatedIngredient = {
            ...ingredient,
            ...newIngredient,
            editedIngredient: undefined,
            editedIngredientIndex: -1,
        };
        const updatedIngredients = [...state.ingredients];
        updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

        return {
            ...state,
            ingredients: updatedIngredients,
        };
    }),
    on(ShoppingListActions.deleteIngredient, (state) => ({
        ...state,
        ingredients: state.ingredients.filter((ingredient, index) => {
            return index !== state.editedIngredientIndex;
        }),
        editedIngredient: undefined,
        editedIngredientIndex: -1,
    })),
    on(ShoppingListActions.startEdit, (state, { id }) => ({
        ...state,
        editedIngredient: { ...state.ingredients[id] },
        editedIngredientIndex: id,
    })),
    on(ShoppingListActions.stopEdit, (state) => ({
        ...state,
        editedIngredient: undefined,
        editedIngredientIndex: -1,
    }))
);

export function reducer(state: State | undefined, action: Action) {
    return shoppingListReducer(state, action);
}
