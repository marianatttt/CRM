import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";

import {ITokens} from "../interfaces/tokens.inteface";
import {IAuthLogin} from "../interfaces";
import {urls} from "../contants";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _accessTokenKey = 'access'
  private readonly _refreshTokenKey= 'refresh'

  constructor(private httpClient :HttpClient) {
  }

  login(user:IAuthLogin):Observable<ITokens>{
    return this.httpClient.post<ITokens>(urls.auth.login, user).pipe(
      tap((tokens)=>{
        this._setTokens(tokens)
      })
    )
  }


  private _setTokens({access, refresh}:ITokens):void{
    localStorage.setItem(this._accessTokenKey, access)
    localStorage.setItem(this._refreshTokenKey, refresh)
  }


  getAccessToken():string{
    return localStorage.getItem(this._accessTokenKey) || '';
  }

}
