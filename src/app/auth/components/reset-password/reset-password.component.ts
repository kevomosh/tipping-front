import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NotifierService} from '../../../shared/services/notifier.service';
import {combineLatest, Subject} from 'rxjs';
import {AuthService} from '../../service/auth.service';
import {map, takeUntil} from 'rxjs/operators';
import {MustMatch} from '../register/mustMatch';
import {HttpErrorResponse} from '@angular/common/http';
import {Alert} from '../../../dto/Alert';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar,
              private notifierService: NotifierService) { }

  rForm = this.fb.group({
    newPassword: ['', [
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$')
    ]],
    cPassword: ['', Validators.required]
  }, {
    validator: MustMatch('newPassword', 'cPassword')
  });

  private destroy$ = new Subject<void>();


  token$ = this.activatedRoute.queryParamMap.pipe(
    map(res => res.get('token'))
  );

   combined$ = combineLatest([this.authService.loading$, this.token$]).pipe(
     map(([loading, token]) => ({
       loading,
       token
     }))
   );

  ngOnInit(): void {
    this.activatedRoute.queryParamMap
      .pipe(map(res => res.get('token')))
      .subscribe(x => console.log(x));
  }

  onSubmit(token: string): void {
    const {cPassword, ...info} = this.rForm.value;
    this.authService.resetPassword(info, token).pipe(
      takeUntil(this.destroy$)
    ).subscribe(res => {
      setTimeout(() => {
        this.authService.setLoading(false);
        this.router.navigateByUrl('/auth');
      }, 3000);
      this.snackBar.open('Successfully Changed password, now being diverted to log in', '', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });

    }, error => {
      this.handleError(error);
    });

  }

  handleError(error: HttpErrorResponse): void {
    this.authService.setLoading(false);
    const e = error.error;
    const btnUrls = ['/auth/forgot-password', '/auth/register'];
    const btnLabels = ['Forgot Password', 'Register'];
    const alert: Alert = {
      status: e.status,
      responseHeader: e.error,
      message: e.message,
      btnLabels,
      btnUrls,
    };
    this.notifierService.showErrorDialog(alert);
    this.rForm.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
