import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {GroupDTO} from '../../dto/groupDTO';
import {LoginView} from '../../views/loginView';
import {LoginDTO} from '../../dto/loginDTO';
import {map, shareReplay, tap} from 'rxjs/operators';
import {RegisterView} from '../../views/registerView';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

 get token$(): Observable<string> {
    return this._token$.asObservable();
 }

  get userName$(): Observable<string>{
    return this._userName$.asObservable();
  }

  get role$(): Observable<string> {
    return this._role$.asObservable();
  }

  get aflGroups$(): Observable<GroupDTO[]> {
    return this._aflGroups$.asObservable();
  }

  get nrlGroups$(): Observable<GroupDTO[]> {
    return this._nrlGroups$.asObservable();
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.token$.pipe(
      map(token => {
        if (token) {
          const decoded = jwt_decode(token);
          // @ts-ignore
          const exp = decoded.exp;
          if (exp === undefined) {
            return false;
          }

          const date = new Date(0);
          const tokenExpDate = date.setUTCSeconds(exp);

          return tokenExpDate.valueOf() > new Date().valueOf();

        } else {
          return false;
        }
      })
    );
  }
  private baseUrl = environment.apiUrl;

  // tslint:disable-next-line:variable-name
  private _userName$ = new BehaviorSubject<string>(localStorage.getItem('username'));
  // tslint:disable-next-line:variable-name
  private _role$ = new BehaviorSubject<string>(localStorage.getItem('role'));

  // tslint:disable-next-line:variable-name
  private _token$ = new BehaviorSubject<string>(localStorage.getItem('token'));

  // tslint:disable-next-line:variable-name
  private _nrlGroups$ = new BehaviorSubject<GroupDTO[]>(
    JSON.parse(localStorage.getItem('nrlGroups'))
  );

  // tslint:disable-next-line:variable-name
  private _aflGroups$ = new BehaviorSubject<GroupDTO[]>(
    JSON.parse(localStorage.getItem('aflGroups'))
  );

  checkCompAndStatus$ = combineLatest([this.isLoggedIn$, this.isInNrl$(), this.isInAfl$()]).pipe(
    map(([isLoggedIn, isInNrl, isInAfl]) => ({
      isLoggedIn,
      isInNrl,
      isInAfl
}))
  );


  getAllGroups(): Observable<{ aflGroups: GroupDTO[], nrlGroups: GroupDTO[] }> {
   const groupsUrl = `${this.baseUrl}/auth/getGroups`;
   return this.http.get<{ aflGroups: GroupDTO[], nrlGroups: GroupDTO[] }>(groupsUrl);
}

  login(loginView: LoginView): Observable<LoginDTO> {
    const loginUrl = `${this.baseUrl}/auth/login`;
    return this.http.post<LoginDTO>(loginUrl, loginView).pipe(
      tap(result => {
        const decodedToken = jwt_decode(result.token);
        // @ts-ignore
        const role = decodedToken.role[0].authority;
        const userName = result.username;

        this._token$.next(result.token);
        this._userName$.next(userName);
        this._role$.next(role);
        this._aflGroups$.next(result.aflGroups);
        this._nrlGroups$.next(result.nrlGroups);

        localStorage.setItem('token', result.token);
        localStorage.setItem('role', role);
        localStorage.setItem('userName', userName);
        localStorage.setItem('nrlGroups', JSON.stringify(result.nrlGroups));
        localStorage.setItem('aflGroups', JSON.stringify(result.aflGroups));

      }),
      shareReplay()
    );
  }

  register(registerView: RegisterView): Observable<{ message: string }> {
    const url = `${this.baseUrl}/auth/register`;
    return this.http.post<{ message: string }>(url, registerView);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('aflGroups');
    localStorage.removeItem('nrlGroups');
    this._token$.next('');
    this._role$.next('');
    this._userName$.next('');
    this._aflGroups$.next([]);
    this._nrlGroups$.next([]);

  }
  private  isInNrl$(): Observable<boolean> {
    return this.nrlGroups$.pipe(
      map(groups => {
        if (groups) {
          return groups.length > 0;
        }
      })
    );
  }

  private  isInAfl$(): Observable<boolean> {
    return this.aflGroups$.pipe(
      map(groups => {
        if (groups) {
          return groups.length > 0;
        }
      })
    );
  }


 }
