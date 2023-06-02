import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import {IComment, IOrder} from "../interfaces";
import {urls} from "../contants";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private httpClient: HttpClient) {
  }
  public getAllCommentsByOrderId(orderId: number): Observable<IComment[]> {
    return this.httpClient.get<IComment[]>(urls.comments.commentsById(orderId.toString()));
  }

  public getOrdersWithComments(orders: IOrder[]): Observable<IOrder[]> {
    const orderIds = orders.map(order => order.id);
    const requests = orderIds.map(orderId => this.getAllCommentsByOrderId(orderId));

    return forkJoin(requests).pipe(
      map(comments => {
        return orders.map((order, index) => {
          order.comments = comments[index];
          return order;
        });
      })
    );
  }
  public addCommentToOrder(orderId: number, comment: string): Observable<IComment> {
    const body = { text: comment};
    return this.httpClient.post<IComment>(urls.comments.commentsById(orderId.toString()), body);
  }
}
