import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Alert} from '../../../dto/Alert';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Alert,
              private router: Router) { }

  ngOnInit(): void {
  }

  reroute(newRoute: string): void {
    this.router.navigateByUrl(newRoute);
  }

}
