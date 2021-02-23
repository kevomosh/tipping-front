import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';
import {combineLatest, Subject} from 'rxjs';
import {map, takeUntil, tap} from 'rxjs/operators';
import {NotifierService} from '../../../shared/services/notifier.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,
              private router: Router,
              private snackBar: MatSnackBar,
              private notifierService: NotifierService,
              private authService: AuthService) { }

  private destroy$ = new Subject<void>();

  combined$ = combineLatest([this.authService.isLoggedIn$, this.authService.loading$]).pipe(
    map(([loggedIn, loading]) => ({
      loggedIn,
      loading
    })),
    tap(res => {
      if (res.loggedIn) {
        this.router.navigateByUrl('/home');
      }
    })
  );

  cpForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  ngOnInit(): void {
  }

  onSubmit(): void {
    const val = this.cpForm.value;
    this.authService.createToken(this.cpForm.value).pipe(
      takeUntil(this.destroy$)
    ).subscribe(res => {
      this.authService.setLoading(false);
      this.snackBar.open('Check Email for link to create new password', '', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }, error => {
      this.authService.setLoading(false);
      const btnUrls = ['/auth/forgot-password', '/auth/register'];
      const btnLabels = ['Try again', 'Register'];
      this.notifierService.displayErrorDialog(error, btnUrls, btnLabels);
      this.cpForm.reset();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
