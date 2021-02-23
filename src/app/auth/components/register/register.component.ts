import {Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MustMatch} from './mustMatch';
import {GroupDTO} from '../../../dto/groupDTO';
import {RegisterView} from '../../../views/registerView';
import {map, takeUntil, tap} from 'rxjs/operators';
import {combineLatest, Subject} from 'rxjs';
import {NotifierService} from '../../../shared/services/notifier.service';
import {HttpErrorResponse} from '@angular/common/http';
import {Alert} from '../../../dto/Alert';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgSelectComponent} from '@ng-select/ng-select';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private router: Router,
              private snackBar: MatSnackBar,
              public notifierService: NotifierService,
  ) { }

  @ViewChildren(NgSelectComponent) children: QueryList<NgSelectComponent>;

  registerForm: FormGroup;

  combined$ = combineLatest([this.authService.isLoggedIn$, this.authService.loading$, this.authService.getAllGroups()]).pipe(
    map(([loggedIn, loading, allGroups]) => ({
      loggedIn,
      loading,
      allGroups
    })),
    tap(res => {
      if (res.loggedIn) {
        this.router.navigateByUrl('/home');
      }
    })
  );

  private destroy$ = new Subject<void>();
  selectedGroups: GroupDTO[] = [];

  onAdd = ($event: any): void => {
    this.selectedGroups.push($event);
  }

  onRemove = ($event: any): void => {
    this.selectedGroups = this.selectedGroups.filter(g => g.id !== $event.value.id);
  }

  onClear(): void {
    this.selectedGroups = [];
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['',
        [Validators.required,
          Validators.minLength(5),
          Validators.maxLength(20)
      ]],
      email: ['', [Validators.required, Validators.email]],
      password: ['',
       [
         Validators.required,
         Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$')
       ],
      ],
      cPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'cPassword')

    });
  }

  onSubmit(): void{
    const result = this.registerForm.value;
    const registerView: RegisterView = {
      name: result.name,
      email: result.email,
      password: result.password,
      groupIds: this.selectedGroups.map(x => x.id)
    };

    this.authService.register(registerView).pipe(
      takeUntil(this.destroy$)
    ).subscribe(x => {
      setTimeout(() => {
        this.authService.setLoading(false);
        this.router.navigateByUrl('/auth');
      }, 3000);
      this.snackBar.open('Successfully registered, now being diverted to log in',
        '', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }, error => {
      this.authService.setLoading(false);
      this.children.forEach(child => child.handleClearClick());
      const btnUrls = ['/auth/register'];
      const btnLabels = ['Try again'];
      this.notifierService.displayErrorDialog(error, btnUrls, btnLabels);
      this.registerForm.reset();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // TODO configure error messages according to error passed
}
