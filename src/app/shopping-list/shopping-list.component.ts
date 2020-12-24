import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
    ingredients: Ingredient[] = [];

    private ingredientChangedSubsctiption: Subscription;

    constructor(private shoppingListService: ShoppingListService) {}

    ngOnInit(): void {
        this.ingredients = this.shoppingListService.getIngeredients();
        this.ingredientChangedSubsctiption = this.shoppingListService.ingredientsChanged.subscribe(
            (ingredients: Ingredient[]) => {
                this.ingredients = ingredients;
            }
        );
    }

    onEditItem(index: number) {
        this.shoppingListService.startedEditing.next(index);
    }

    ngOnDestroy(): void {
        this.ingredientChangedSubsctiption.unsubscribe();
    }
}
