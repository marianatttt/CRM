import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, tap} from "rxjs";

import {ITokens} from "../interfaces/tokens.inteface";
import {IAuth} from "../interfaces";
import {urls} from "../contants";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _accessTokenKey = 'access';
  private readonly _refreshTokenKey = 'refresh';
  private authUser: BehaviorSubject<IAuth | null> = new BehaviorSubject<IAuth | null>(null);

  constructor(private httpClient: HttpClient) {
  }


  login(user: IAuth): Observable<ITokens> {
    return this.httpClient.post<ITokens>(urls.auth.login, user).pipe(
      tap((tokens) => {
        this._setTokens(tokens)
        this.me().subscribe(user => this.setAuthUser(user))
      })
    )
  }

  refresh(refresh: string): Observable<ITokens> {
    return this.httpClient.post<ITokens>(urls.auth.refresh, {refresh}).pipe(
      tap((tokens) => {
        this._setTokens(tokens)
      })
    )
  }

  me(): Observable<IAuth> {
    return this.httpClient.get<IAuth>(urls.auth.me);
  }

  getAuthUser(): Observable<IAuth | null> {
    return this.authUser.asObservable();
  }

  setAuthUser(user: IAuth | null): void {
    this.authUser.next(user);
  }

  _setTokens({ access_token, refresh_token }: ITokens): void {
    localStorage.setItem(this._accessTokenKey, access_token);
    localStorage.setItem(this._refreshTokenKey, refresh_token);
  }

  getAccessToken(): string {
    return localStorage.getItem(this._accessTokenKey) || '';
  }

  getRefreshToken(): string {
    return localStorage.getItem(this._refreshTokenKey) || '';
  }

  deleteTokens(): void {
    localStorage.removeItem(this._accessTokenKey);
    localStorage.removeItem(this._refreshTokenKey);
  }
}
