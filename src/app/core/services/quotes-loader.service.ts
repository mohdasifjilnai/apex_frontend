import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuotesLoaderService {
  private quotesLoaderSubject = new BehaviorSubject<boolean>(false);

  constructor() { }
    /**
   * this show function use loader show
   */
     show() {
      this.quotesLoaderSubject.next(true);
    }
    /**
     * this hide function use loader hide
     */
    hide() {
      this.quotesLoaderSubject.next(false);
    }
    /**
     * this function use for send true or false
     */
    isLoading() {
      return this.quotesLoaderSubject.asObservable();
    }
}
