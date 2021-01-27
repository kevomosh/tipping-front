import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AccessDeniedComponent} from './main/components/access-denied/access-denied.component';
import {HomeComponent} from './main/components/home/home.component';

const routes: Routes = [
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  { path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },

  { path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  {path: 'home', component: HomeComponent},
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
