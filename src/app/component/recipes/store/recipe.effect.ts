import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Recipe } from 'src/app/model/recipe.model';
import * as RecipesActions from '../store/recipe.actions';
import * as fromApp from '../../../store/app.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class RecipeEffects{
    @Effect()
    fectchRecipes = this.actions$.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(() => {
            return this.http.get<Recipe[]>('https://shoppingcart-e985f-default-rtdb.firebaseio.com/recipes.json');
        }), map(recipes => {
            return recipes.map(recipe => {
                return { 
                    ...recipe, 
                    ingredients: recipe.ingredients ? recipe.ingredients : [] 
                };
            });
        }), map(recipes => {
            return new RecipesActions.SetRecipes(recipes);
        })
    );

    @Effect({dispatch: false})
    storeRecipes = this.actions$
        .pipe(
           ofType(RecipesActions.STORE_RECIPES),
           withLatestFrom(this.store.select('recipes')),
           switchMap(([actionData, recipesState]) => {
            return this.http.put('https://shoppingcart-e985f-default-rtdb.firebaseio.com/recipes.json', recipesState.recipes); 
           })
        )

    constructor(private actions$: Actions, private http : HttpClient, private store : Store<fromApp.AppState>){}
}