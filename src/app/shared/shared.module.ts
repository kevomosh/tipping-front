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
import {MatSliderModule} from '@angular/material/slider';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgSelectModule } from '@ng-select/ng-select';
import { ErrorComponent } from './components/error/error.component';
import { PickFormComponent } from './components/pick-form/pick-form.component';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';

const matModules = [MatRadioModule, MatCardModule,
  MatButtonModule, MatButtonToggleModule,
  MatFormFieldModule, MatInputModule,
  MatToolbarModule, MatSnackBarModule,
  MatDialogModule, MatSelectModule,
  MatIconModule, MatCheckboxModule,
  MatSliderModule, MatSidenavModule,
  MatListModule, MatMenuModule,
  MatProgressSpinnerModule, MatDatepickerModule,
  MatNativeDateModule, NgxMatTimepickerModule,
  NgxMatDatetimePickerModule, NgxMatNativeDateModule];

@NgModule({
  declarations: [ErrorComponent, PickFormComponent],
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
    NgSelectModule,
    PickFormComponent
  ]
})
export class SharedModule { }
