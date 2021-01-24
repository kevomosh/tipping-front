import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import {AuthCompGuard} from '../main/services/auth-comp.guard';
import {PickComponent} from './components/pick/pick.component';
import {MakePicComponent} from './components/make-pic/make-pic.component';

const routes: Routes = [
  { path: 'make-pick/:comp/:weekNumber',
    canActivate: [AuthCompGuard],
    data: {info: ['ROLE_ADMIN', 'ROLE_USER']},
    component: MakePicComponent
  },
  { path: 'make-pick/:comp',
    canActivate: [AuthCompGuard],
    data: {info: ['ROLE_ADMIN', 'ROLE_USER']},
    component: MakePicComponent
  },
  { path: 'pick/:comp/:weekNumber',
    canActivate: [AuthCompGuard],
    data: {info: ['ROLE_ADMIN', 'ROLE_USER']},
    component: PickComponent
  },
  { path: 'pick/:comp',
    canActivate: [AuthCompGuard],
    data: {info: ['ROLE_ADMIN', 'ROLE_USER']},
    component: PickComponent
  },
  { path: 'results/:comp',
    canActivate: [AuthCompGuard],
    data: {info: ['ROLE_ADMIN', 'ROLE_USER']},
    component: UserComponent
  }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
