import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
    selector: 'app-shopping-edit',
    templateUrl: './shopping-edit.component.html',
    styleUrls: ['./shopping-edit.component.scss'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
    @ViewChild('f', { static: true }) shoppingListForm: NgForm;
    subscription: Subscription;
    editMode = false;
    editedItem?: Ingredient;

    constructor(private store: Store<fromApp.AppState>) {}

    ngOnInit(): void {
        this.subscription = this.store
            .select('shoppingList')
            .subscribe(stateData => {
                if (stateData.editedIngredientIndex > -1) {
                    this.editMode = true;
                    this.editedItem = stateData.editedIngredient;
                    this.shoppingListForm.setValue({
                        name: this.editedItem?.name,
                        amount: this.editedItem?.amount,
                    });
                } else {
                    this.editMode = false;
                }
            });
    }

    onSubmit(form: NgForm): void {
        const value = form.value;
        const ingredient = new Ingredient(value.name, value.amount);
        if (this.editMode) {
            this.store.dispatch(
                ShoppingListActions.updateIngredient({
                    newIngredient: ingredient,
                })
            );
        } else {
            this.store.dispatch(
                ShoppingListActions.addIngredient({ ingredient })
            );
        }

        this.onClear();
    }

    onClear() {
        this.editMode = false;
        this.shoppingListForm.reset();
        this.store.dispatch(ShoppingListActions.stopEdit());
    }

    onDelete() {
        this.store.dispatch(
            ShoppingListActions.deleteIngredient()
        );
        this.onClear();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.store.dispatch(ShoppingListActions.stopEdit());
    }
}
