import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Observer, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrl: './recipes-list.component.css',
})
export class RecipesListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  recipesSubsriber: Subscription;
  constructor(
    private recipeService: RecipeService,
    private activeatedRoute: ActivatedRoute
  ) {
    activeatedRoute.data.subscribe(({ recipes }) => (this.recipes = recipes));
  }

  ngOnInit(): void {
    this.recipesSubsriber = this.recipeService.recipesChanged.subscribe(
      (recipes) => {
        this.recipes = recipes;
      }
    );
  }
  ngOnDestroy(): void {
    this.recipesSubsriber.unsubscribe();
  }
}
