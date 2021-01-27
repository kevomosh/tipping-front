import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ErrorComponent} from '../components/error/error.component';
import {AlertDTO} from '../../dto/AlertDTO';

@Injectable({
  providedIn: 'any'
})
export class NotifierService {

  constructor(private snackBar: MatSnackBar) { }
  showNotification(dataToSend: AlertDTO): void {
    this.snackBar.openFromComponent(ErrorComponent, {
      data: dataToSend,
      duration: dataToSend.duration,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: dataToSend.type
    });
  }

  // showNotification(dataToSend: any, messageType: 'error' | 'success', duration: number): void {
  //   dataToSend.type = messageType;
  //   this.snackBar.openFromComponent(ErrorComponent, {
  //     data: dataToSend,
  //     duration,
  //     horizontalPosition: 'center',
  //     verticalPosition: 'bottom',
  //     panelClass: messageType
  //   });
  // }
}
