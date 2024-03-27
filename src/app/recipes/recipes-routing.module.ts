import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { recipesResolver } from './recipes-resolver';
import { RecipesComponent } from './recipes.component';
import { authGuard } from '../auth/auth.guard';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipesDetailComponent } from './recipes-detail/recipes-detail.component';

const RecipesRoutes: Routes = [
  {
    path: '',
    component: RecipesComponent,
    canActivate: [authGuard],
    resolve: { recipes: recipesResolver },
    children: [
      { path: 'new', component: RecipeEditComponent },
      { path: ':id', component: RecipesDetailComponent },
      { path: ':id/edit', component: RecipeEditComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(RecipesRoutes)],
  exports: [RouterModule],
})
export class RecipeRoutesModule {}
