import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

import {IComment} from "../interfaces";
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

  public addCommentToOrder(orderId: number, comment: string): Observable<IComment> {
    const body = { text: comment};
    return this.httpClient.post<IComment>(urls.comments.commentsById(orderId.toString()), body);
  }
}
