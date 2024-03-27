import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Ingredient } from '../../shared/ingredient-model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrl: './shopping-edit.component.css',
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') form: NgForm;
  ingredientSelected: Subscription;
  editMode: boolean = false;
  selIngIndex: number;
  constructor(
    private shoppingListService: ShoppingListService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.ingredientSelected =
      this.shoppingListService.selecteIngredientChanged.subscribe((index) => {
        this.editMode = true;
        this.selIngIndex = index;
        const ingredient = this.shoppingListService.getIngredient(index);
        this.form.setValue({
          name: ingredient.name,
          amount: ingredient.amount,
        });
      });
  }
  onAddIngredient(): void {
    const name = this.form.value['name'];
    const amount = this.form.value['amount'];
    const ingredient = new Ingredient(name, amount);
    if (this.editMode) {
      this.shoppingListService.editIngredient(this.selIngIndex, ingredient);
      this.editMode = false;
      this.form.reset();
    } else {
      this.shoppingListService.addIngredient(ingredient);
      this.form.reset();
    }
  }

  onClickDelete(): void {
    this.shoppingListService.deleteIngredient(this.selIngIndex);
    this.editMode = false;
    this.form.reset();
  }

  onClear(): void {
    this.form.reset();
    this.editMode = false;
  }

  ngOnDestroy(): void {
    this.ingredientSelected.unsubscribe();
  }
}
