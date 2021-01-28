import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import {AuthCompGuard} from '../main/services/auth-comp.guard';
import {CreateWeekComponent} from './components/create-week/create-week.component';

const routes: Routes = [
  { path: 'create-week/:comp',
    canActivate: [AuthCompGuard],
    data: {info: ['ROLE_ADMIN']},
    component: CreateWeekComponent
  },
  { path: '',
    canActivate: [AuthCompGuard],
    data: {info: ['ROLE_ADMIN']},
    component: AdminComponent
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
