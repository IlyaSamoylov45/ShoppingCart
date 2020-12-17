import { CommonModule } from '@angular/common';
import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CoreModule } from 'src/app/core.module';
import { SharedModule } from 'src/app/shared.module';
import { AuthComponent } from './auth.component';

@NgModule({
    declarations: [AuthComponent],
    imports: [CommonModule, FormsModule, RouterModule.forChild([{ path: '', component: AuthComponent }]), SharedModule]
})

export class AuthModule {

}