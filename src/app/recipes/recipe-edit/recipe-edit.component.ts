import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { Ingredient } from '../../shared/ingredient-model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.css',
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editmode: boolean = false;
  form: FormGroup;
  recipe: Recipe;
  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = +params.id;
      this.editmode = params.id != null;
      if (this.editmode) {
        this.recipe = this.recipeService.getRecipeById(this.id);
      }
      this.initForm();
    });
  }

  onAddIngredient() {
    (<FormArray>this.form.get('ingredientsControl')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDecription = '';
    let recipeIngredients = new FormArray<
      FormGroup<{ name: FormControl; amount: FormControl }>
    >([]);
    if (this.editmode) {
      recipeName = this.recipe.name;
      recipeImagePath = this.recipe.imagePath;
      recipeDecription = this.recipe.description;
      if (this.recipe.ingredients) {
        for (let ingredient of this.recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ]),
            })
          );
        }
      }
    }
    this.form = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDecription, Validators.required),
      ingredientsControl: recipeIngredients,
    });
  }

  onSubmit() {
    const { name, description, imagePath } = this.form.value;
    const ingredients = [...this.form.get('ingredientsControl').value];
    if (this.editmode) {
      this.recipeService.updateRecipe(
        this.id,
        new Recipe(name, description, imagePath, ingredients)
      );
    } else {
      this.recipeService.addRecipe(
        new Recipe(name, description, imagePath, ingredients)
      );
    }
    this.router.navigate(['../'])
  }

  onDelete(id: number){
    (<FormArray>this.form.get('ingredientsControl')).removeAt(id)
  }

  onCancel(){
    this.router.navigate(['../'])
  }
}
