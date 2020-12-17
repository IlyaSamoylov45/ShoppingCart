import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
    { path: '', redirectTo: '/recipes', pathMatch: 'full' },
    { path: 'recipes', loadChildren: './component/recipes/recipes.module#RecipesModule' },
    { path: 'shopping-list', loadChildren: './component/shopping-list/shopping-list.module#ShoppingListModule' },
    { path: 'auth', loadChildren: './component/auth/auth.module#AuthModule' }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
export class AppRoutingModule {

}