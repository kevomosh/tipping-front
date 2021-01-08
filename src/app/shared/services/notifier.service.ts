import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ErrorComponent} from '../components/error/error.component';

@Injectable({
  providedIn: 'any'
})
export class NotifierService {

  constructor(private snackBar: MatSnackBar) { }

  showNotification(dataToSend: any, messageType: 'error' | 'success', duration: number): void {
    dataToSend.type = messageType;
    this.snackBar.openFromComponent(ErrorComponent, {
      data: dataToSend,
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: messageType
    });
  }
}
