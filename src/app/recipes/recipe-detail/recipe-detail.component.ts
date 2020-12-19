import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from 'src/app/shopping-list/shopping-list.service';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
    selector: 'app-recipe-detail',
    templateUrl: './recipe-detail.component.html',
    styleUrls: ['./recipe-detail.component.scss'],
})
export class RecipeDetailComponent implements OnInit {
    recipe: Recipe;

    constructor(
        private shoppingListService: ShoppingListService,
        private route: ActivatedRoute,
        private recipeService: RecipeService
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            const id = Number(params['id']);
            this.recipe = this.recipeService.getRecipe(id);
        });
    }

    onAddToShoppingList() {
        this.shoppingListService.addIngredients(this.recipe.ingredients);
    }
}
