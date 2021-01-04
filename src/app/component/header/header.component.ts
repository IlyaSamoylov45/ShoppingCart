import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  collapsed = true;
  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.store.select('auth').pipe(map(authState =>
      authState.user
    )).subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  onSaveData() {
    this.store.dispatch(new RecipeActions.StoreRecipes())
  }

  onFetchData() {
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }

}
