import { Injectable, NgZone } from '@angular/core';
import { fromEvent, merge, Observable, Subject, timer } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private userActivity$: Observable<Event>;
  private idleTimeout$: Observable<number>;
  private stopTimer$ = new Subject<void>();

  constructor(private ngZone: NgZone) {
    this.userActivity$ = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'scroll'),
      fromEvent(document, 'click')
    );

    this.idleTimeout$ = timer(2 * 60 * 100);
  }

  startWatching() {
    this.ngZone.runOutsideAngular(() => {
      this.userActivity$
        .pipe(
          debounceTime(50),  // Optional: debounce user activity events
          switchMap(() => this.idleTimeout$),
          takeUntil(this.stopTimer$)
        )
        .subscribe(() => {
          this.ngZone.run(() => {
            console.log('No user activity for 10 minutes.');
          });
        });
    });
  }

  stopWatching() {
    this.stopTimer$.next();
  }
}
