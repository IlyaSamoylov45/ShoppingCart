import * as fromShoppingList from '../component/shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../component/auth/store/auth.reducer';
import * as fromRecipes from '../component/recipes/store/recipe.reducer';

import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
    shoppingList: fromShoppingList.State;
    auth: fromAuth.State;
    recipes: fromRecipes.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    shoppingList: fromShoppingList.shoppingListReducer,
    auth: fromAuth.authReducer,
    recipes: fromRecipes.recipeReducer
};