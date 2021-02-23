import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../auth/service/auth.service';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) { }

  comb$ = this.authService.menuObs.pipe(
    tap(res => {
      if (res.nrlGroups && res.aflGroups) {
        if (res.nrlGroups.length > 0 && res.aflGroups.length === 0) {
          this.router.navigateByUrl('/user/results/nrl');
        } else if (res.aflGroups.length > 0 && res.nrlGroups.length === 0) {
          this.router.navigateByUrl('/user/results/afl');
        }
      }
    })
  );

  ngOnInit(): void {
  }

}
