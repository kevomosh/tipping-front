import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {combineLatest, Observable} from 'rxjs';
import {AuthService} from '../../auth/service/auth.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthCompGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    return  combineLatest([this.authService.isLoggedIn$, this.authService.role$,
      this.authService.nrlGroups$, this.authService.aflGroups$]).pipe(
        map(([isLoggedIn, role, nrlGroups, aflGroups]) => {
          if (!isLoggedIn) {
            this.router.navigate(['/auth'], {
              queryParams: { returnUrl: state.url }
            });
            return false;
          }

          if (nrlGroups == null || aflGroups == null) {
            this.router.navigate(['/auth'], {
              queryParams: { returnUrl: state.url }
            });
            return false;
          }

          const info = route.data.info as Array<string>;
          const auth = info.includes(role);
          if (!auth) {
            this.router.navigateByUrl('/access-denied');
          }

          if (info.length === 2) {
            const comp = route.paramMap.get('comp');
            let allowed: boolean;
            switch (comp) {
              case 'nrl':
                allowed =  nrlGroups.length > 0;
                break;
              case 'afl':
                allowed = aflGroups.length > 0;
                break;
              default :
                allowed = false;
                break;
            }
            if (!allowed){
              this.router.navigateByUrl('/access-denied');
            }
            return allowed;
          } else if (info.length === 1 && role === 'ROLE_ADMIN') {
            return true;
          } else {
            this.router.navigateByUrl('/access-denied');
          }

        })
    );
  }



}
