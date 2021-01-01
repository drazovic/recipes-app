import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from '../../shopping-list/store/shopping-list.reducer';

@Component({
    selector: 'app-recipe-detail',
    templateUrl: './recipe-detail.component.html',
    styleUrls: ['./recipe-detail.component.scss'],
})
export class RecipeDetailComponent implements OnInit {
    recipe: Recipe;
    recipeId: number;

    constructor(
        private shoppingListService: ShoppingListService,
        private route: ActivatedRoute,
        private router: Router,
        private recipeService: RecipeService,
        private store: Store<{ shoppingList: fromShoppingList.AppState }>
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.recipeId = Number(params['id']);
            this.recipe = this.recipeService.getRecipe(this.recipeId);
        });
    }

    onAddToShoppingList() {
        this.store.dispatch(
            ShoppingListActions.addIngredients({
                ingredients: this.recipe.ingredients,
            })
        );
    }

    onDeleteRecipe() {
        this.recipeService.deleteRecipe(this.recipeId);
        this.router.navigate(['/recipes']);
    }
}
