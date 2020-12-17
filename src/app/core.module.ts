import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from "@angular/core";
import { AuthGuard } from './component/auth/auth.guard';
import { AuthInterceptorService } from './service/auth-interceptor.service';
import { AuthService } from './service/auth.service';
import { DataStorageService } from './service/data-storage.service';
import { RecipeResolverService } from './service/recipe-resolver.service';
import { RecipeService } from './service/recipe.service';

@NgModule({
    providers: [
        RecipeService,
        DataStorageService,
        RecipeResolverService,
        AuthService,
        AuthGuard,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
    ]
})
export class CoreModule {

}