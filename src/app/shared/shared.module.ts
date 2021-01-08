import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgSelectModule } from '@ng-select/ng-select';
import { ErrorComponent } from './components/error/error.component';

const matModules = [MatRadioModule, MatCardModule,
  MatButtonModule, MatButtonToggleModule,
  MatFormFieldModule, MatInputModule,
  MatToolbarModule, MatSnackBarModule,
  MatDialogModule, MatSelectModule,
  MatIconModule, MatCheckboxModule];

@NgModule({
  declarations: [ErrorComponent],
  imports: [
    CommonModule,
    matModules,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    NgSelectModule,
  ],
  exports : [
    CommonModule,
    matModules,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    ErrorComponent,
    NgSelectModule
  ]
})
export class SharedModule { }
