import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingListComponent } from './shopping-list.component';

const ShoppingListRoutes: Routes = [
  { path: '', component: ShoppingListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(ShoppingListRoutes)],
  exports: [RouterModule],
})
export class ShoppingListRoutesModule {}
