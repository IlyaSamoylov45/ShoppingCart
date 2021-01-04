import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Login } from 'src/app/model/login.model';
import { AuthService } from 'src/app/service/auth.service';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    private storeSub: Subscription;

    constructor(private authService: AuthService, private router: Router, private store: Store<fromApp.AppState>) { }

    ngOnInit() {
        this.storeSub = this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading;
            this.error = authState.authError;

        });
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }
        const login: Login = new Login(form.value.email, form.value.password);
        if (this.isLoginMode) {
            this.store.dispatch(new AuthActions.LoginStart({ ...login }));
        } else {
            this.store.dispatch(new AuthActions.SignupStart({ ...login }));
        }

        form.reset();
    }

    onHandleError() {
        this.store.dispatch(new AuthActions.ClearError());
    }

    ngOnDestroy() {
        if (this.storeSub) {
            this.storeSub.unsubscribe();
        }
    }
}