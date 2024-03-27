import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponseData, User, _User } from './user.type';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import {environment } from '../../environments/environment'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  public user = new BehaviorSubject<_User>(null);
  private tokenTimer: any;
  constructor(private http: HttpClient, private router: Router) {}

  signup(user: User): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseApiKey,
        { ...user, returnSecureToken: true }
      )
      .pipe(
        catchError((err: any) => {
          let error: string = '';
          switch (err.error.error.message) {
            case 'EMAIL_EXISTS':
              error = 'The email address is already in use by another account.';
              break;
            case 'OPERATION_NOT_ALLOWED':
              error = 'Password sign-in is disabled for this project';
              break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
              error =
                'We have blocked all requests from this device due to unusual activity. Try again later';
              break;
            default:
              error = 'Something went wrong';
          }

          throw error;
        }),
        tap((resData) => this.handleAuthUser(resData))
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new _User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      console.log(expirationDuration);
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, expirationDuration);
  }

  logOut() {
    localStorage.removeItem('userData');
    this.user.next(null);
    if (this.tokenTimer) {
      clearTimeout(this.tokenTimer);
    }
    this.tokenTimer = null;
    this.router.navigate(['/auth']);
  }

  private handleAuthUser({ email, localId, idToken, expiresIn }) {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const newUser = new _User(email, localId, idToken, expirationDate);
    localStorage.setItem('userData', JSON.stringify(newUser));
    this.user.next(newUser);
    this.autoLogout(expiresIn * 1000);
  }

  login(user: User): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseApiKey,
        { ...user, returnSecureToken: true }
      )
      .pipe(
        catchError((err) => {
          console.log(err);
          let error: string = '';
          console.log(err);
          switch (err.error.error.message) {
            case 'INVALID_LOGIN_CREDENTIALS':
              error = 'Please check your password or email';
              break;
            default:
              error = 'Something went wrong';
          }

          throw error;
        }),
        tap((resData) => this.handleAuthUser(resData))
      );
  }
}
