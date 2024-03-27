import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recipes-detail',
  templateUrl: './recipes-detail.component.html',
  styleUrl: './recipes-detail.component.css',
})
export class RecipesDetailComponent implements OnInit {
  currentRecipe: Recipe;
  recipeId: number;
  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.recipeId = +params.id;
      const recipe = this.recipeService.getRecipes()[+this.recipeId];
      if (!recipe) {
        this.router.navigate(['recipes']);
      } else {
        this.currentRecipe = recipe;
      }
    });
  }
  addIngredientsToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(
      this.currentRecipe.ingredients
    );
  }

  onDelete(){
    this.recipeService.deleteRecipe(this.recipeId)
    this.router.navigate(['../'])
  }
}
