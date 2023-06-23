import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

import {IOrder} from '../interfaces';
import {urls} from "../contants";




  @Injectable({
    providedIn: 'root'
  })
  export class OrderService {
    constructor(private httpClient: HttpClient) {}

    public getPaginatedOrders(
      page: number,
      limit: number,
      sortColumn: string,
      sortDirection: string,
      filterParams: any,
      startDate?: string,
      endDate?: string
    ): Observable<{ data: IOrder[]; total: number }> {
      let queryString = `page=${page}&limit=${limit}`;

      if (sortColumn && sortDirection) {
        const sortParams = `${sortColumn}:${sortDirection}`;
        queryString += `&sort=${encodeURIComponent(sortParams)}`;
      }

      if (Object.keys(filterParams).length > 0) {
        const filters = Object.entries(filterParams)
          .map(([key, value]) => `${key}:${value}`)
          .join(',');

        queryString += `&filter=${encodeURIComponent(filters)}`;
      }

      if (startDate) {
        queryString += `&startDate=${encodeURIComponent(startDate)}`;
      }

      if (endDate) {
        queryString += `&endDate=${encodeURIComponent(endDate)}`;
      }

      const url = `${urls.order.order}?${queryString}`;
      console.log(url);
      return this.httpClient.get<{ data: IOrder[]; total: number }>(url);
    }
  }





















