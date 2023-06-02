import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
} from '@angular/common/http';
import {AuthService} from "./services";

@Injectable()
export class MainInterceptor implements HttpInterceptor {


  constructor(private authService: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): any{
    const accessToken = this.authService.getAccessToken()

    if (accessToken) {
      request = this.addToken(request, accessToken)
    }

  }


  addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {Authorization: `Bearer ${token}`}
    })
  }

}






