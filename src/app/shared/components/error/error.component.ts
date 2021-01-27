import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ErrorDTO} from '../../../dto/errorDTO';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {AlertDTO} from '../../../dto/AlertDTO';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: AlertDTO,
              private router: Router,
              public snackBarRef: MatSnackBarRef<ErrorComponent>) { }

  ngOnInit(): void {
  }

  dismissAndReroute(newRoute: string): void {
    this.router.navigateByUrl(newRoute);
    this.snackBarRef.dismiss();
  }

}
