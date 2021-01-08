import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ErrorDTO} from '../../../dto/errorDTO';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
              private router: Router,
              public snackBarRef: MatSnackBarRef<ErrorComponent>) { }

  ngOnInit(): void {
  }

  dismissAndReroute(): void {
    this.router.navigateByUrl('/register');
    this.snackBarRef.dismiss();
  }

}
