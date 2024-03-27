import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import {  map, tap } from 'rxjs';
import { AuthServiceService } from '../auth/auth-service.service';
import { _User } from '../auth/user.type';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  private URL =
    'https://angular-recipe-book-dfa70-default-rtdb.europe-west1.firebasedatabase.app/';

  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthServiceService
  ) {}

  storeRecipes() {
    this.http
      .put(`${this.URL}recipes.json`, this.recipeService.getRecipes())
      .subscribe((res: HttpResponse<any>) => console.log(res.statusText));
  }
  getRecipes() {
    return this.http.get<Recipe[]>(`${this.URL}recipes.json`).pipe(
      map((recipes) => {
        return recipes?.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      tap((recipes) => this.recipeService.setRecipes(recipes ? recipes : []))
    );
  }
}
