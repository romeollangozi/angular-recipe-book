import { NgModule } from '@angular/core';
import { ShoppingListComponent } from '../shopping-list/shopping-list.component';
import { ShoppingEditComponent } from '../shopping-list/shopping-edit/shopping-edit.component';
import { FormsModule } from '@angular/forms';
import { ShoppingListRoutesModule } from './shoping-list-routes.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ShoppingListComponent, ShoppingEditComponent],
  imports: [ FormsModule, ShoppingListRoutesModule, SharedModule],
})
export class ShoppingListModule {}
