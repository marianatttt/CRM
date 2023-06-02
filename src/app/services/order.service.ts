import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {IOrder} from '../interfaces';
import {urls} from "../contants";




  @Injectable({
    providedIn: 'root'
  })
  export class OrderService {
    constructor( private httpClient: HttpClient) {
    }
    public getPaginatedOrders(
      page: number,
      limit: number,
      sortColumn: string,
      sortDirection: string,
      filters: any
    ): Observable<{ data: IOrder[]; total: number }> {
      let queryString = `page=${page}&limit=${limit}&sortColumn=${sortColumn}&sortDirection=${sortDirection}`;

      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryString += `&${key}=${encodeURIComponent(filters[key])}`;
        }
      });
      const url = `${urls.order.order}?${queryString}`;
      return this.httpClient.get<{ data: IOrder[]; total: number }>(url);
    }
  }
