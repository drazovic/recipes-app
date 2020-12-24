import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
    selector: 'app-recipe-edit',
    templateUrl: './recipe-edit.component.html',
    styleUrls: ['./recipe-edit.component.scss'],
})
export class RecipeEditComponent implements OnInit {
    id: number;
    isEditMode = false;
    recipeForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private recipeService: RecipeService
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
            const recipe = this.recipeService.getRecipe(this.id);
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
                            amount: new FormControl(ingredient.amount, [
                                Validators.required,
                                Validators.pattern(/^[1-9]+[0-9]*$/),
                            ]),
                        })
                    );
                }
            }
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
            this.recipeService.updateRecipe(this.id, this.recipeForm.value);
        } else {
            this.recipeService.addRecipe(this.recipeForm.value);
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
}
