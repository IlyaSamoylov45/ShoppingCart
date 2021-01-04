import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Recipe } from 'src/app/model/recipe.model';
import { Actions, ofType } from '@ngrx/effects';

import * as fromApp from '../store/app.reducer';
import * as RecipeActions from '../component/recipes/store/recipe.actions';
import { map, switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class RecipeResolverService implements Resolve<Recipe[]>{
    constructor(private store : Store<fromApp.AppState>, private actions$ : Actions) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return this.store.select('recipes')
            .pipe(
                take(1),
                map(recipeState => {
                    return recipeState.recipes;
                }),
                switchMap(recipes => {
                    if(recipes.length === 0){
                        this.store.dispatch(new RecipeActions.FetchRecipes());
                        return this.actions$.pipe(ofType(RecipeActions.SET_RECIPES), take(1));
                    }else{
                        return of(recipes);
                    }
                }) 
            );
            
        
    }
}