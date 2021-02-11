import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';

@Component({
    selector: 'app-recipe-edit',
    templateUrl: './recipe-edit.component.html',
    styleUrls: ['./recipe-edit.component.scss'],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
    id: number;
    isEditMode = false;
    recipeForm: FormGroup;

    private storeSubscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<fromApp.AppState>
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.id = +params['id'];
            this.isEditMode = Boolean(params['id']);
            this.initForm();
        });
    }

    private initForm() {
        let recipeName = '';
        let recipeImageUrl = '';
        let recipeDescription = '';
        let recipeIngredients = new FormArray([]);

        if (this.isEditMode) {
            this.storeSubscription = this.store
                .select('recipes')
                .pipe(
                    map((recipesState) => {
                        return recipesState.recipes.find(
                            (recipe, index) => index === this.id
                        );
                    })
                )
                .subscribe((recipe) => {
                    if (recipe) {
                        recipeName = recipe.name;
                        recipeImageUrl = recipe.imageUrl;
                        recipeDescription = recipe.description;
                        if (recipe.ingredients) {
                            for (let ingredient of recipe.ingredients) {
                                recipeIngredients.push(
                                    new FormGroup({
                                        name: new FormControl(
                                            ingredient.name,
                                            Validators.required
                                        ),
                                        amount: new FormControl(
                                            ingredient.amount,
                                            [
                                                Validators.required,
                                                Validators.pattern(
                                                    /^[1-9]+[0-9]*$/
                                                ),
                                            ]
                                        ),
                                    })
                                );
                            }
                        }
                    }
                });
        }

        this.recipeForm = new FormGroup({
            name: new FormControl(recipeName, Validators.required),
            imageUrl: new FormControl(recipeImageUrl, Validators.required),
            description: new FormControl(
                recipeDescription,
                Validators.required
            ),
            ingredients: recipeIngredients,
        });
    }

    get ingredientsControls() {
        return (<FormArray>this.recipeForm.get('ingredients')).controls;
    }

    onSubmit() {
        if (this.isEditMode) {
            this.store.dispatch(
                RecipeActions.updateRecipe({
                    index: this.id,
                    newRecipe: this.recipeForm.value,
                })
            );
        } else {
            this.store.dispatch(RecipeActions.addRecipe(this.recipeForm.value));
        }

        this.onCancel();
    }

    onCancel() {
        this.router.navigate(['../'], { relativeTo: this.route });
    }

    onAddIngredient() {
        (<FormArray>this.recipeForm.get('ingredients')).push(
            new FormGroup({
                name: new FormControl(null, Validators.required),
                amount: new FormControl(null, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/),
                ]),
            })
        );
    }

    onDeleteIngredient(index: number) {
        (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
    }

    ngOnDestroy() {
        if (this.storeSubscription) {
            this.storeSubscription.unsubscribe();
        }
    }
}
