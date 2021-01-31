import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ErrorComponent} from '../components/error/error.component';
import {AlertDTO} from '../../dto/AlertDTO';
import {MatDialog} from '@angular/material/dialog';
import {ErrorDialogComponent} from '../components/error-dialog/error-dialog.component';
import {Alert} from '../../dto/Alert';

@Injectable({
  providedIn: 'any'
})
export class NotifierService {

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) { }
  showNotification(dataToSend: AlertDTO): void {
    this.snackBar.openFromComponent(ErrorComponent, {
        data: dataToSend,
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: dataToSend.type
      });
  }

  showErrorDialog(data: Alert): void {
    this.dialog.open(ErrorDialogComponent, {data, disableClose: true} );
  }
}
