import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IAuth} from "../interfaces";
import {urls} from "../contants";

@Injectable({
  providedIn:'root'
})

export class UserService{
  constructor(private httpClient:HttpClient) {
  }

  getAll():Observable<IAuth>{
    return this.httpClient.get<IAuth>(urls.users.users)
  }

}
