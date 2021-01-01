import { createAction, props } from '@ngrx/store';

import { Ingredient } from 'src/app/shared/ingredient.model';

export const addIngredient = createAction(
    '[Shopping-List] addIngredient',
    props<{ ingredient: Ingredient }>()
);

export const addIngredients = createAction(
    '[Shopping-List] addIngredients',
    props<{ ingredients: Ingredient[] }>()
);

export const updateIngredient = createAction(
    '[Shopping-List] updateIngredient',
    props<{ newIngredient: Ingredient }>()
);

export const deleteIngredient = createAction(
    '[Shopping-List] deleteIngredient'
);

export const startEdit = createAction(
    '[Shopping-List] startEdit',
    props<{ id: number }>()
);

export const stopEdit = createAction('[Shopping-List] stopEdit');
