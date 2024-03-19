import { Injectable, OnDestroy } from '@angular/core';
import { Observable, timer, Subscription, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  switchMap,
  tap,
  share,
  retry,
  takeUntil,
  timeout,
  mergeMap,
  take,
  concatMap,
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LongPollingService implements OnDestroy {
  private allQuotesData;

  private stopPolling = new Subject();
  transactionIdData: any;
  quotesId: any;

  constructor(private http: HttpClient) {
    // this.allQuotesData = timer(1, 3000).pipe(
    //   concatMap(() =>
    //     http.get(
    //       `/api/v1/generate_quotes/${this.transactionIdData}/${this.quotesId}`
    //     )
    //   ),
    //   take(5),
    //   tap(console.log)
    // );
    this.allQuotesData = timer(1, 5000).pipe(
      concatMap(() =>
        http.get(
          `/api/v1/generate_quotes/${this.transactionIdData}/${this.quotesId}`
        )
      ),
      retry(),
      take(15),
      share(),
      takeUntil(this.stopPolling)
    );
  }
  ngOnDestroy(): void {
    // this.stopPolling.next();
  }

  getAllQuotes(transaction_id: any, quotes_id: any) {
    this.transactionIdData = transaction_id;
    this.quotesId = quotes_id;
    return this.allQuotesData;
  }
}
