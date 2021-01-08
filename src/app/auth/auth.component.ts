import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from './service/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {LoginView} from '../views/loginView';
import {takeUntil} from 'rxjs/operators';
import {NotifierService} from '../shared/services/notifier.service';
import {ErrorDTO} from '../dto/errorDTO';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  constructor(private authService: AuthService,
              private activeRoute: ActivatedRoute,
              private fb: FormBuilder,
              public dialog: MatDialog,
              public notifierService: NotifierService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

 // TODO make sure to implement if user is already logged in

  private destroy$ = new Subject<void>();
  loginForm: FormGroup;
  returnUrl: string;

  ngOnInit(): void {
    // TODO Change end of return url to correct one
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || '/register';
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(40)
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
      const errotDTO: ErrorDTO = error.error;
      errotDTO.btnUrl = 'Please try Again';

      this.notifierService.showNotification(errotDTO, 'error', 5000);
      this.loginForm.reset();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
