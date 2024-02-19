import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loaderSubject = new BehaviorSubject<boolean>(false);

  constructor() {}
  /**
   * this show function use loader show
   */
  show() {
    this.loaderSubject.next(true);
  }
  /**
   * this hide function use loader hide
   */
  hide() {
    this.loaderSubject.next(false);
  }
  /**
   * this function use for send true or false
   */
  isLoading() {
    return this.loaderSubject.asObservable();
  }
}
