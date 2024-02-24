import { Injectable, OnDestroy } from '@angular/core';
import { Observable, timer, Subscription, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { switchMap, tap, share, retry, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LongPollingService implements OnDestroy {
  private allCurrencies$;

  private stopPolling = new Subject();
  transactionIdData: any;
  quotesId: any;
  constructor(private http: HttpClient) {
    this.allCurrencies$ = timer(1, 15000).pipe(
      switchMap(() =>
        http.get(
          `/api/v1/generate_quotes/${this.transactionIdData}/${this.quotesId}`
        )
      ),
      retry(),
      tap(console.log),
      share(),
      takeUntil(this.stopPolling)
    );
  }
  ngOnDestroy(): void {
    // this.stopPolling.next();
  }

  getAllCurrencies(transaction_id: any, quotes_id: any) {
    this.transactionIdData = transaction_id;
    this.quotesId = quotes_id;
    return this.allCurrencies$;
  }
}
