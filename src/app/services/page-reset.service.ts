import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PageResetService {
  private resetPageSource = new Subject<void>();
  resetPage$ = this.resetPageSource.asObservable();
  constructor() { }

  resetPage() {
    this.resetPageSource.next();
  }
}
