import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

import {IOrder} from "../interfaces";
import {urls} from "../contants";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient) {
  }

  getPaginatedOrders(page: number, limit: number,sortColumn: string, sortDirection: string

  ): Observable<{ data: IOrder[], total: number }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortColumn', sortColumn)
      .set('sortDirection', sortDirection)


    return this.httpClient.get<{ data: IOrder[], total: number }>(urls.order.order, {params});
  }
}

