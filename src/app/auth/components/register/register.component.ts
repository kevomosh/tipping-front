import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MustMatch} from './mustMatch';
import {GroupDTO} from '../../../dto/groupDTO';
import {RegisterView} from '../../../views/registerView';
import {takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {NotifierService} from '../../../shared/services/notifier.service';
import {AlertDTO} from '../../../dto/AlertDTO';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private router: Router,
              public notifierService: NotifierService,
  ) { }
              registerForm: FormGroup;

  allGroups$ = this.authService.getAllGroups();
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

  // TODO check if person is already logged in then redirect
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['',
        [Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20)
      ]],
      email: ['', [Validators.required, Validators.email]],
      password: ['',
       [
         Validators.required,
         Validators.minLength(5),
         Validators.maxLength(40)
       ],
      ],
      cpassword: ['', Validators.required]
    },
      {
        Validator: MustMatch('password', 'cpassword'),
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
      // TODO change url to appropriate one
      this.router.navigateByUrl('');
    }, error => {
      const e = error.error;
      const alert = new AlertDTO(e.status, e.error, e.message, 'bottom',
        5000, 'error', ['Please try again'], ['/auth/register']);
      this.notifierService.showNotification(alert);
      this.registerForm.reset();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // TODO confirm password to work
  // TODO configure error messages according to error passed
}
