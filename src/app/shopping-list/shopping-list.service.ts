import { Ingredient } from '../shared/ingredient-model';
import { Subject } from 'rxjs';
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  selecteIngredientChanged = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 4),
  ];

  getIngredients(): Ingredient[] {
    return this.ingredients.slice();
  }

  getIngredientNames() {
    const names = [];
    this.ingredients.map((ingredient) =>
      names.push(ingredient.name.toLowerCase())
    );
    return names;
  }
  addIngredient(ingredient: Ingredient) {
    if (this.getIngredientNames().includes(ingredient.name.toLowerCase())) {
      this.ingredients.map((i) => {
        if (i.name.toLowerCase() === ingredient.name.toLowerCase()) {
          i.amount += ingredient.amount;
        }
      });
    } else {
      this.ingredients.push(ingredient);
    }
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  editIngredient(index: number, ingredient: Ingredient) {
    this.ingredients[index] = ingredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  getIngredient(index: number) {
    return this.ingredients[index];
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
