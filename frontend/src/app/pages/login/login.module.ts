import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { CookiesLoginComponent } from '@components/modals/cookies-login/cookies-login.component';
import { SharedModule } from '@components/shared/shared.module';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatCheckboxModule,
    MatDialogModule,
    SharedModule,
    LoginRoutingModule,
  ],
  declarations: [LoginComponent, CookiesLoginComponent],
})
export class LoginModule {}
