import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ErrorComponent} from '../components/error/error.component';
import {AlertDTO} from '../../dto/AlertDTO';
import {MatDialog} from '@angular/material/dialog';
import {ErrorDialogComponent} from '../components/error-dialog/error-dialog.component';
import {Alert} from '../../dto/Alert';
import {HttpErrorResponse} from '@angular/common/http';

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

  displayErrorDialog(error: HttpErrorResponse, btnUrls: string[], btnLabels: string[]): void {
    const e = error.error;
    const data: Alert = {
      status: e.status,
      responseHeader: e.error,
      message: e.message,
      btnLabels,
      btnUrls,
    };
    this.dialog.open(ErrorDialogComponent, {data, disableClose: true} );
  }

  displaySuccessDialog(message: string,  btnUrls: string[], btnLabels: string[]): void {
    const data: Alert = {
        status: 200,
        responseHeader: 'success',
        message,
        btnLabels,
        btnUrls
    };
    this.dialog.open(ErrorDialogComponent, {data, disableClose: true} );

  }
  showErrorDialog(data: Alert): void {
    this.dialog.open(ErrorDialogComponent, {data, disableClose: true} );
  }
}
