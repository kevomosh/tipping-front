import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import {SharedModule} from '../shared/shared.module';
import { RegisterComponent } from './components/register/register.component';


@NgModule({
  declarations: [AuthComponent, RegisterComponent],
  imports: [
    SharedModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }