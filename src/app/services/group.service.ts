import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { IGroup} from "../interfaces";
import {urls} from "../contants";

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(
    private httpClient:HttpClient) {
  }


  getAllGroup():Observable<IGroup[]>{
    return this.httpClient.get<IGroup[]>(urls.groups.groups)
  }

  createGroup(group:IGroup):Observable<IGroup>{
    return this.httpClient.post<IGroup>(urls.groups.groups, group)
  }

}
