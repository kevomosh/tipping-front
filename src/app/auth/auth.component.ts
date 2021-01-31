import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from './service/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {combineLatest, Subject} from 'rxjs';
import {LoginView} from '../views/loginView';
import {map, takeUntil, tap} from 'rxjs/operators';
import {NotifierService} from '../shared/services/notifier.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Alert} from '../dto/Alert';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService,
              private activeRoute: ActivatedRoute,
              private fb: FormBuilder,
              public notifierService: NotifierService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  loading$ = this.authService.loading$;

  combined$ = combineLatest([this.authService.isLoggedIn$, this.loading$]).pipe(
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

  private destroy$ = new Subject<void>();
  loginForm: FormGroup;
  returnUrl: string;

  ngOnInit(): void {
    // TODO Change end of return url to correct one
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || '/user/results/nrl';
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$')
        ]
      ]
    });
  }

  onSubmit(): void {
    const loginView: LoginView = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };
    this.authService.login(loginView).pipe(
      takeUntil(this.destroy$)
    ).subscribe(x => {
      this.router.navigateByUrl(this.returnUrl);
    }, error => {
      this.authService.setLoading(false);
      this.handleError(error);
    });
  }

  handleError(error: HttpErrorResponse): void {
    const e = error.error;
    const btnUrls = ['/auth', '/auth/change-password'];
    const btnLabels = ['Try again', 'Change Password'];
    const alert: Alert = {
      status: e.status,
      responseHeader: e.error,
      message: e.message,
      btnLabels,
      btnUrls,
    };
    this.notifierService.showErrorDialog(alert);
    this.loginForm.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
