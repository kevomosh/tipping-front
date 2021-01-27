import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {SharedModule} from '../shared/shared.module';
import {FormsModule} from '@angular/forms';
import { FilterComponent } from './components/filter/filter.component';
import { PickComponent } from './components/pick/pick.component';
import { MakePicComponent } from './components/make-pic/make-pic.component';
import { TimerComponent } from './components/timer/timer.component';

const matModules = [MatTableModule, MatProgressBarModule,
MatSortModule, MatPaginatorModule];
@NgModule({
  declarations: [UserComponent, FilterComponent,
    PickComponent, MakePicComponent, TimerComponent],
    imports: [
        CommonModule,
        UserRoutingModule,
        SharedModule,
        NgxDatatableModule,
        matModules,
        FormsModule
    ]
})
export class UserModule { }
